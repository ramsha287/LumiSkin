# fix_models.py
import os
import json
import logging
import h5py
import traceback
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, model_from_json, Model
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Input, Dense  # add any layer types your model uses



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("model_fixer")

def inspect_h5(path):
    logger.info(f"\n--- Inspecting {path} ---")
    with h5py.File(path, "r") as hf:
        has_config = 'model_config' in hf.attrs
        logger.info(f"Has model_config attr: {has_config}")
        if has_config:
            raw = hf.attrs['model_config']
            if isinstance(raw, (bytes, bytearray)):
                raw = raw.decode('utf-8')
            # print a short excerpt
            logger.info("model_config JSON excerpt:")
            logger.info(raw[:1000].replace("\n"," "))
            try:
                j = json.loads(raw)
                # try find build_input_shape if present
                def find_shapes(obj, found):
                    if isinstance(obj, dict):
                        for k,v in obj.items():
                            if k in ("build_input_shape","batch_input_shape","batch_shape") and isinstance(v, list):
                                found.append((k, v))
                            find_shapes(v, found)
                    elif isinstance(obj, list):
                        for it in obj:
                            find_shapes(it, found)
                found = []
                find_shapes(j, found)
                if found:
                    logger.info("Found shape entries (key, value) samples:")
                    for k,v in found[:5]:
                        logger.info(f" - {k}: {v}")
            except Exception:
                logger.warning("Could not parse model_config JSON (too large to show).")

def patch_channels_in_json_obj(obj):
    """Recursively change trailing channel dim 1 -> 3 in lists that look like shapes."""
    patched = False
    if isinstance(obj, dict):
        for k in list(obj.keys()):
            v = obj[k]
            if isinstance(v, list) and len(v) >= 4 and all(isinstance(x,(int,type(None))) for x in v):
                # shape list, check last element
                last = v[-1]
                if last == 1:
                    obj[k][-1] = 3
                    patched = True
            else:
                subpatched = patch_channels_in_json_obj(v)
                patched = patched or subpatched
    elif isinstance(obj, list):
        for idx, it in enumerate(obj):
            subpatched = patch_channels_in_json_obj(it)
            patched = patched or subpatched
            # also if list is a numeric shape list-like
            if isinstance(it, list) and len(it) >= 4 and all(isinstance(x,(int,type(None))) for x in it):
                if it[-1] == 1:
                    obj[idx][-1] = 3
                    patched = True
    return patched

def attempt_rebuild_from_hdf5(path, model_name):
    with h5py.File(path, "r") as hf:
        if 'model_config' not in hf.attrs:
            raise RuntimeError("No model_config found in HDF5 (weights-only or unexpected format).")

        raw = hf.attrs['model_config']
        if isinstance(raw, (bytes, bytearray)):
            raw = raw.decode('utf-8')

    # Try raw model_from_json first
    try:
        logger.info(f"{model_name}: trying model_from_json(raw) ...")
        model = model_from_json(raw)
        logger.info(f"{model_name}: model_from_json() succeeded. Loading weights ...")
        model.load_weights(path)
        logger.info(f"{model_name}: model.load_weights() succeeded.")
        return model, "from_json+load_weights"
    except Exception as e:
        logger.warning(f"{model_name}: model_from_json+load_weights failed: {e}")

    # Parse JSON and try to patch channel dims 1->3
    try:
        j = json.loads(raw)
    except Exception as e:
        raise RuntimeError(f"Failed to parse model_config json: {e}")

    patched = patch_channels_in_json_obj(j)
    if patched:
        logger.info(f"{model_name}: patched JSON to replace channel dims 1->3 where found. Attempting rebuild.")
        new_json = json.dumps(j)
        try:
            model = model_from_json(new_json)
            logger.info(f"{model_name}: rebuilt model from patched JSON. Loading weights with skip_mismatch=True by_name=True ...")
            model.load_weights(path, by_name=True, skip_mismatch=True)
            logger.info(f"{model_name}: loaded weights (skip_mismatch=True).")
            return model, "patched_json+load_weights_skip_mismatch"
        except Exception as e:
            logger.warning(f"{model_name}: patched rebuild failed: {e}\n{traceback.format_exc()}")

    # Last resort: model_from_json + load_weights(by_name=True, skip_mismatch=True) without patch
    try:
        logger.info(f"{model_name}: final attempt: model_from_json + load_weights(by_name=True, skip_mismatch=True)")
        model = model_from_json(raw)
        model.load_weights(path, by_name=True, skip_mismatch=True)
        logger.info(f"{model_name}: loaded via final attempt.")
        return model, "from_json+load_weights_skip_mismatch"
    except Exception as e:
        raise RuntimeError(f"{model_name}: all rebuild attempts failed: {e}")

def wrap_multi_input_to_first(model, model_name):
    if isinstance(model.input, list) and len(model.input) > 1:
        logger.info(f"{model_name}: model has {len(model.input)} inputs; wrapping to single-input using first input.")
        model = Model(inputs=model.input[0], outputs=model.output)
    return model

def save_fixed(model, orig_path):
    base, ext = os.path.splitext(orig_path)
    new_path = base + "_fixed" + ext
    logger.info(f"saving repaired model to {new_path} ...")
    model.save(new_path, include_optimizer=False)
    return new_path

def load_or_fix(path, name):
    # 1) try load_model directly
    try:
        model = load_model(path, compile=False)
        logger.info(f"{name}: load_model succeeded.")
        model = wrap_multi_input_to_first(model, name)
        return model, "load_model"
    except Exception as e:
        logger.warning(f"{name}: load_model failed: {e}")

    # 2) try rebuild via JSON/weights
    try:
        model, method = attempt_rebuild_from_hdf5(path, name)
        model = wrap_multi_input_to_first(model, name)
        # save the repaired model to disk so next time load_model works quickly
        try:
            new_path = save_fixed(model, path)
            logger.info(f"{name}: repaired model saved at {new_path}")
        except Exception as e_save:
            logger.warning(f"{name}: could not save repaired model: {e_save}")
        return model, method
    except Exception as e2:
        logger.error(f"{name}: rebuild attempts failed: {e2}")
        raise

if __name__ == "__main__":
    # replace these with your actual model files
    model_files = {
        "acne": r"D:\my projects\LumiSkin\ml-service\models\acne_model.h5",
        "pigmentation": r"D:\my projects\LumiSkin\ml-service\models\pigmentation_model.h5",
        "wrinkles": r"D:\my projects\LumiSkin\ml-service\models\wrinkle_model.h5",
        "pores": r"D:\my projects\LumiSkin\ml-service\models\pore_model.h5"
    }


    for name, path in model_files.items():
        try:
            if not os.path.exists(path):
                logger.error(f"{name}: path not found: {path}")
                continue
            inspect_h5(path)
            model, method = load_or_fix(path, name)
            logger.info(f"{name}: READY (method={method}). input_shape={model.input_shape}, outputs={model.output_shape}")
        except Exception as e:
            logger.error(f"{name}: could not repair/load: {e}\n{traceback.format_exc()}")
