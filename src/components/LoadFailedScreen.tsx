// Shown when no UI dictionary could load, so its text cannot come from a dictionary.
const MESSAGES: { lang: string; text: string }[] = [
  { lang: 'zh-TW', text: '無法載入介面文字，請確認網路連線後重試。' },
  { lang: 'zh-CN', text: '无法加载界面文字，请检查网络连接后重试。' },
  { lang: 'en', text: "Couldn't load the app's text. Check your connection and try again." },
  { lang: 'ko', text: '앱 텍스트를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도하세요.' },
  { lang: 'es', text: 'No se pudo cargar el texto de la aplicación. Comprueba tu conexión e inténtalo de nuevo.' },
];

export function LoadFailedScreen() {
  return (
    <div className="min-h-screen bg-[#E9E1CF] text-[#221F18] font-sans flex items-center justify-center p-4">
      <div role="alert" className="max-w-md w-full bg-[#F4EEDE] border border-[#D9CDB2] rounded-3xl p-6 space-y-4 text-center">
        <ul className="space-y-2 text-sm leading-relaxed text-[#55503F]">
          {MESSAGES.map(({ lang, text }) => (
            <li key={lang} lang={lang}>
              {text}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-[#5C6B3D] hover:bg-[#47552F] text-[#F1EFE0] font-extrabold text-sm rounded-2xl cursor-pointer"
        >
          <span lang="zh-TW">重試</span> / <span lang="en">Retry</span>
        </button>
      </div>
    </div>
  );
}
