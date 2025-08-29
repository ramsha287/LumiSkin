import { body } from 'express-validator';

const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];


const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];  

const updateProfileValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),    
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const deleteAccountValidation = [
  body('password').notEmpty().withMessage('Password is required to delete account')
];

export { registerValidation, loginValidation, updateProfileValidation, changePasswordValidation, deleteAccountValidation };