// import this:
import Script from "next/script";

export default function SenjaPage() {
  return (
    <main>
      <div
        className="senja-embed"
        data-id="99859872-0f6f-4b86-93c5-dd9f95dc0003"
        data-lazyload="false"
        data-mode="shadow"
      ></div>
			{/* This changed from <script> to <Script> */}
      <Script
        async
        type="text/javascript"
        src="https://static.senja.io/dist/platform.js"
      ></Script>
    </main>
  );
}