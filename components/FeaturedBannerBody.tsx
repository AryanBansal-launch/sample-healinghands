import { Fragment, type ReactNode } from "react";

const BLOCK_SPLIT = /\n\s*\n/;
const PHONE_RE = /(\+91[\s-]?9355733831|919355733831|9355733831)/g;

function linkifyPhones(text: string): ReactNode {
  const parts = text.split(PHONE_RE);
  return parts.map((part, i) => {
    const digits = part.replace(/\D/g, "");
    if (digits.endsWith("9355733831") && digits.length >= 10) {
      return (
        <a
          key={i}
          href="tel:+919355733831"
          className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-800"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function isBulletBlock(block: string): boolean {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length >= 2 && lines.every((l) => /^[•\-\u2013]\s/.test(l));
}

/** Last block only: avoid styling a normal paragraph as a footer. */
function looksLikeSignatureBlock(block: string): boolean {
  const lower = block.toLowerCase();
  const hasPhone = /\b9355733831\b|\+91[\s-]?9355733831/.test(block);
  const hasBrand = lower.includes("healing hands") && lower.includes("preyanka");
  return hasPhone || hasBrand;
}

function renderBulletBlock(block: string, key: number) {
  const items = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[•\-\u2013]\s*/, ""));
  return (
    <ul key={key} className="my-1 list-none space-y-2.5 border-l-2 border-primary-200/80 py-0.5 pl-4">
      {items.map((item, j) => (
        <li
          key={j}
          className="relative pl-1 text-[15px] leading-relaxed text-gray-700 sm:text-base before:absolute before:-left-3 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary-400"
        >
          {linkifyPhones(item)}
        </li>
      ))}
    </ul>
  );
}

type Props = {
  content: string;
};

export default function FeaturedBannerBody({ content }: Props) {
  const blocks = content.split(BLOCK_SPLIT).map((b) => b.trim()).filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  if (blocks.length === 1 && !isBulletBlock(blocks[0])) {
    return (
      <div className="space-y-3 font-serif text-[15px] leading-relaxed text-gray-800 sm:text-base">
        {blocks[0].split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {linkifyPhones(line)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const isFirst = i === 0;
        const isFooter =
          i === blocks.length - 1 && blocks.length > 1 && looksLikeSignatureBlock(block);

        if (isBulletBlock(block)) {
          return renderBulletBlock(block, i);
        }

        if (isFirst) {
          return (
            <h2
              key={i}
              className="font-serif text-xl font-semibold leading-snug tracking-tight text-primary-950 sm:text-2xl"
            >
              {block.split("\n").map((line, li) => (
                <Fragment key={li}>
                  {li > 0 && <br />}
                  {linkifyPhones(line)}
                </Fragment>
              ))}
            </h2>
          );
        }

        if (isFooter) {
          return (
            <footer
              key={i}
              className="mt-6 space-y-2 border-t border-primary-100/90 pt-5 text-center text-sm leading-relaxed text-gray-600 sm:text-left"
            >
              {block
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, li) => (
                  <div
                    key={li}
                    className={
                      li === 0
                        ? "text-sm italic text-gray-500"
                        : li === 1
                          ? "font-serif text-lg font-semibold text-gray-900 sm:text-xl"
                          : li === 2
                            ? "text-[11px] font-bold uppercase tracking-[0.22em] text-primary-800"
                            : li === 3
                              ? "text-base font-medium text-gray-800"
                              : "text-[13px] leading-snug text-gray-600"
                    }
                  >
                    {linkifyPhones(line)}
                  </div>
                ))}
            </footer>
          );
        }

        return (
          <p
            key={i}
            className="text-[15px] leading-relaxed text-gray-700 sm:text-base"
          >
            {block.split("\n").map((line, li) => {
              const t = line.trim();
              if (!t) {
                return <br key={li} />;
              }
              return (
                <Fragment key={li}>
                  {li > 0 && <br />}
                  {linkifyPhones(t)}
                </Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
