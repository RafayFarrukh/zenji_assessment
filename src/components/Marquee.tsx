const MESSAGES = [
  'The Origin Drop — ten pieces, no restocks',
  'Free shipping Australia-wide over A$150',
  'New in: Water Breathing Tee',
  'Printed and packed in Melbourne',
];

/**
 * Announcement bar. The list is rendered twice and the track translates -50%,
 * which loops seamlessly at any viewport width. The duplicate is hidden from
 * assistive tech so the messages are only announced once.
 */
export function Marquee() {
  return (
    <div className="border-ink-line bg-ink-raised border-b">
      <div className="hide-scrollbar overflow-hidden">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="label text-ash flex shrink-0 items-center"
              aria-hidden={copy === 1 || undefined}
            >
              {MESSAGES.map((message) => (
                <li key={message} className="flex items-center py-2.5">
                  <span className="px-6">{message}</span>
                  <span aria-hidden className="text-flame">
                    ◆
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
