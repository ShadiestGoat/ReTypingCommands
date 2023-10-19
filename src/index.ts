import { Injector } from "replugged";
import { ApplicationCommandOptionType } from "replugged/dist/types";

const inject = new Injector();

const LINK_BOUNDARIES = " ()[]";

export function start(): void {
  inject.utils.registerSlashCommand({
    name: "alt",
    description: "Send a message with aLtErNaTiNg CaPs",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "message",
        description: "The message you want to alt",
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
            if (LINK_BOUNDARIES.includes(v)) {
              let start = inp.slice(i + 1);
              isInLink = start.startsWith("http://") || start.startsWith("https://");
              if (isInLink) {
                shouldCap = false;
              }

              return v;
            }

            if (isInLink) {
              return v;
            }

            let genOG = String.prototype.toUpperCase,
              genNew = String.prototype.toLowerCase;

            if (shouldCap) {
              genOG = String.prototype.toLowerCase;
              genNew = String.prototype.toUpperCase;
            }

            let vOg = genOG.call(v);
            let vNew = genNew.call(v);

            // Don't skip a cap for syntax stuff like [ or *
            if (vOg != vNew) {
              shouldCap = !shouldCap;
            }

            return vNew;
          })
          .join(""),
        send: true,
      };
    },
  });

  inject.utils.registerSlashCommand({
    name: "annoy",
    description: "Send a message with individual spoiler ||t||||a||||g||||s||",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "message",
        description: "The message you want to spoiler. Note: md & links don't work <3",
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
