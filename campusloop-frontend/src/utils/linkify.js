import React from "react";

export default function Linkify({ text }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return React.createElement(
    React.Fragment,
    null,
    parts.map((part, i) => {
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return React.createElement(
          "a",
          {
            key: i,
            href: part,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 underline hover:text-blue-700 break-all",
          },
          part
        );
      }
      return React.createElement("span", { key: i }, part);
    })
  );
}