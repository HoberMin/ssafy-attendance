import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bug, Github } from "lucide-react";

const Header = () => (
  <div className="bg-white border-b">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center h-24 py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3396f4] to-blue-500 bg-clip-text text-transparent mb-4">
          SSAFY 출결 생성기
        </h1>
        <div className="flex items-center gap-3 absolute right-[30px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://github.com/ssafy-attendance-document/ssafy-attendance/issues",
                      "_blank"
                    )
                  }
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                >
                  <Bug className="h-4 w-4" />
                  <span className="text-sm font-medium">Issue</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Issue 생성하기</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://github.com/ssafy-attendance-document/ssafy-attendance",
                      "_blank"
                    )
                  }
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                >
                  <Github className="h-4 w-4" />
                  <span className="text-sm font-medium">GitHub</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub로 이동</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
