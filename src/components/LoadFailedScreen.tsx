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
    <div className="min-h-screen bg-[color:var(--paper-91)] text-[color:var(--ink-24)] font-sans flex items-center justify-center p-4">
      <div role="alert" className="max-w-md w-full bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-3xl p-6 space-y-4 text-center">
        <ul className="space-y-2 text-sm leading-relaxed text-[color:var(--ink-43)]">
          {MESSAGES.map(({ lang, text }) => (
            <li key={lang} lang={lang}>
              {text}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-[color:var(--moss-50)] hover:bg-[color:var(--moss-43)] text-[color:var(--paper-95)] font-extrabold text-sm rounded-2xl cursor-pointer"
        >
          <span lang="zh-TW">重試</span> / <span lang="en">Retry</span>
        </button>
      </div>
    </div>
  );
}
