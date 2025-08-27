
import "./globals.css";
import { ReduxProvider } from "../store/ReduxProvider";

export const metadata = {
  title: "LumiSkin",
  description: "AI Skin Analyzer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
