import { Github } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/HoberMin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="text-sm font-medium">HoberMin</span>
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="https://github.com/yejinleee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="text-sm font-medium">yejinleee</span>
          </a>
        </div>
        <div className="text-center text-sm text-gray-500">
          © 2025 HoberMin. All rights reserved.
        </div>
        <a
          href="https://hits.seeyoufarm.com"
          style={{
            display: "flex",
            justifyContent: "center",
            margin: " 0 0 20px",
          }}
        >
          <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fssafy-attendance.vercel.app&count_bg=%233396F4&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
