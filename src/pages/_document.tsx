import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <title>싸피 출결 소명 생성기</title>

        {/* 기본 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO 메타 태그 */}
        <meta
          name="description"
          content="싸피 재학생들을 위한 출결소명 생성기"
        />
        <meta name="keywords" content="싸피, 출결소명, 출결소명생성기" />

        {/* Open Graph 메타 태그 */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="싸피 출결 소명 생성기" />
        <meta
          property="og:description"
          content="싸피 재학생들을 위한 출결소명 생성기"
        />
        <meta property="og:image" content="/logo.svg" />
        <meta
          property="og:url"
          content="https://ssafy-attendance.vercel.app/"
        />

        {/* 파비콘 */}
        <link rel="icon" href="/logo.svg" />

        {/* 추가적인 SEO 최적화 태그 */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="hobermin" />
        <link rel="canonical" href="https://ssafy-attendance.vercel.app/" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
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
      </body>
    </Html>
  );
}
