import Image from "next/image";
import { Great_Vibes } from "next/font/google";
import { Playfair_Display } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  weight: "700",
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <div className="relative w-full min-h-[600px]">
      {/* Hero section with background */}
      <div className="relative w-full min-h-[400px] flex items-center justify-center">
        <div className="z-10 flex flex-col items-center text-center space-y-2 relative">
          <h1
            className={`${playfair.className} text-5xl md:text-7xl font-bold text-white drop-shadow-lg relative -left-10 shiny-effect`}
          >
            Let's
          </h1>
          <h1
            className={`${greatVibes.className} text-8xl md:text-9xl text-white drop-shadow-lg shiny-effect`}
          >
            Glow
          </h1>
          <h1
            className={`${playfair.className} text-5xl md:text-7xl font-bold text-white drop-shadow-lg relative -right-10 shiny-effect`}
          >
            Girls
          </h1>
        </div>

        <img
          src="/images/home.png"
          alt="Model with glossy skin"
          className="w-full h-full object-cover object-top"
        />

      </div>

      {/* Center oval image with surrounding cards + side text */}
      <div className="relative flex flex-col lg:flex-row justify-center items-center my-16 lg:space-x-20">

        {/* LEFT SIDE DECORATION WITH TEXT */}
        <div className="hidden lg:flex flex-col items-center justify-center relative w-1/4">
          <Image
            src="/images/Matte Lipstick.jpeg" // replace with your uploaded image path
            alt="Decor Brush Left"
            width={180}
            height={180}
            className="absolute opacity-80"
          />
        </div>

        {/* Center image + cards */}
        <div className="relative w-[320px] h-[320px] flex justify-center items-center">
          <img
            src="/images/oval.png"
            alt="Center Image"
            width={320}
            height={320}
            className="object-contain"
          />


          {/* Cards around the image */}
          <div className="absolute -top-0 -left-28">
            <div className="bg-gray-200 shadow-gray-300 shadow-lg rounded-2xl p-4 w-48 text-center">
              <p className={`${playfair.className} font-semibold text-sm text-black`}>
                Know Your Skin. Glow with Confidence.
              </p>
            </div>
          </div>

          <div className="absolute -top-10 -right-28">
            <div className="bg-gray-200 shadow-gray-300 shadow-lg rounded-2xl p-4 w-48 text-center">
              <p className={`${playfair.className} font-semibold text-sm text-black`}>
                Smart Analysis, Personalized Care.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-10 -left-28">
            <div className="bg-gray-200 shadow-gray-300 shadow-lg rounded-2xl p-4 w-48 text-center">
              <p className={`${playfair.className} font-semibold text-sm text-black`}>
                Discover What Your Skin Really Needs.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-0 -right-28">
            <div className="bg-gray-200 shadow-gray-300 shadow-lg rounded-2xl p-4 w-48 text-center">
              <p className={`${playfair.className} font-semibold text-sm text-black`}>
                Science Meets Radiance.
              </p>
            </div>
          </div>
        </div>



        {/* RIGHT SIDE DECORATION WITH TEXT */}
        <div className="hidden lg:flex flex-col items-center justify-center relative w-1/4">
          <img
            src="/images/Matte Lipstick.jpeg" // reuse or use another mark image
            alt="Decor Brush Right"
            width={180}
            height={180}
            className="absolute opacity-80 rotate-180"
          />
        </div>

      </div>
    </div>
  );
}
