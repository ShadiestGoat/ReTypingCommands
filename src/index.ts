import { Injector } from "replugged";

const inject = new Injector();

const LINK_BOUNDARIES = " ()[]";

export function start(): void {
  inject.utils.registerSlashCommand({
    name: "alt",
    description: "Send a message with aLtErNaTiNg CaPs",
    options: [
      {
        type: 3,
        name: "message",
        description: "The message you want to aLt CaSe",
        required: true,
      },
    ],
    executor: (i) => {
      const inp = i.getValue("message");

      let isInLink = false,
        shouldCap = false;

      return {
        result: inp
          .split("")
          .map((v, i) => {
            if (LINK_BOUNDARIES.includes(v) || i == 0) {
              let start = inp.slice(i + 1);
              isInLink = start.startsWith("http://") || start.startsWith("https://");
              if (isInLink) {
                shouldCap = false;
                return v;
              }
            }

            if (isInLink) {
              return v;
            }

            // More consistent & understandable case alt here, thanks @12944qwerty
            const upper = v.toUpperCase(),
                  lower = v.toLowerCase();

            if (upper != lower) {
              shouldCap = !shouldCap;
              return !shouldCap ? upper : lower;
            }

            return v;
          })
          .join(""),
        send: true,
      };
    },
  });

  inject.utils.registerSlashCommand({
    name: "annoy",
    description: "Send a message with individual spoiler tags",
    options: [
      {
        type: 3,
        name: "message",
        description: "The message you want to spoiler. Note: md breaks!",
        required: true,
      },
    ],
    executor: (i) => {
      return {
        result: i
          .getValue("message")
          .split("")
          .map((v) => `||${v}||`)
          .join(""),
        send: true,
      };
    },
  });
}

export function stop(): void {
  inject.uninjectAll();
}
