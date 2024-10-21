type ToastType = "info" | "success" | "danger" | "default" | "warning";
type ToastManagerOptions = {
  timeout?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  containerElement?: HTMLElement;
};
export class ToastManager {
  private toastContainer?: HTMLElement;
  private options: ToastManagerOptions;
  private toastsContainerId = `toasts-${crypto.randomUUID()}`;

  ToastsCSS = `
    #${this.toastsContainerId} {
      position: fixed;
      z-index: 9999 !important;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      &.bottom-left {
        bottom: 0;
        left: 0;
      }

      &.bottom-right {
        bottom: 0;
        right: 0;
      }

      &.top-left {
        top: 0;
        left: 0;
      }

      &.top-right {
        top: 0;
        right: 0;
      }
      .toast {
        --color: #333;
        background-color: white;
        color: var(--color);
        border: 1px solid #eee;
        border-radius: 0.5rem;
        min-width: 8rem;
        max-width: 15rem;
        word-wrap: break-word;
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        position: relative;
        animation: toast 0.4s ease-in-out;
        overflow: hidden;
        cursor: pointer;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0.25rem;
          background-color: var(--color);
          animation: progress var(--toast-duration) linear both;
          transform-origin: left;
        }

        &.toast-success {
          --color: #2ecc71;
        }

        &.toast-warning {
          --color: #f1c40f;
        }

        &.toast-danger {
          --color: #e74c3c;
        }

        &.toast-info {
          --color: #3498db;
        }
      }
    }

    @keyframes progress {
      0% {
        transform: scaleX(0);
      }
      100% {
        transform: scaleX(1);
      }
    }

    @keyframes toast {
      0% {
        transform: translateX(100px);
        opacity: 0;
      }
      85% {
        transform: translateX(-1rem);
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;

  public get containerElement() {
    return this.toastContainer;
  }

  constructor(options: ToastManagerOptions = {}) {
    this.options = { timeout: 3000, position: "bottom-right", ...options };
  }

  private addToastStyles() {
    const style = document.createElement("style");
    style.innerHTML = this.ToastsCSS;
    document.head.appendChild(style);
  }

  setup() {
    const element = document.getElementById(this.toastsContainerId);
    if (element) return;

    this.addToastStyles();
    const toastContainer = document.createElement("div");
    toastContainer.id = this.toastsContainerId;
    toastContainer.classList.add(this.options?.position || "bottom-right");

    // add toast container to body
    (this.options.containerElement || document.body).appendChild(
      toastContainer
    );

    // set toast container
    this.toastContainer = toastContainer;
  }

  toast(message: string, type: ToastType = "default") {
    const toast = new Toast({
      message,
      type,
      duration: this.options.timeout,
    });
    if (!this.toastContainer) throw new Error("Toast container not set");
    this.toastContainer.appendChild(toast.element);
    toast.show();
  }

  success(message: string) {
    this.toast(message, "success");
  }

  info(message: string) {
    this.toast(message, "info");
  }

  danger(message: string) {
    this.toast(message, "danger");
  }

  warning(message: string) {
    this.toast(message, "warning");
  }
}

class Toast {
  public element: HTMLElement;
  private timeoutId: NodeJS.Timeout | null = null;
  private duration: number;
  constructor({
    message,
    duration = 3000,
    type = "default",
    onClick,
  }: {
    message: string;
    type?: ToastType;
    duration?: number;
    onClick?: () => void;
  }) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add(`toast-${type}`);
    toast.style.setProperty("--toast-duration", `${duration}ms`);
    toast.innerText = message;

    this.element = toast;
    this.duration = duration;

    this.element.addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
        onClick?.();
        this.dismiss();
      },
      {
        once: true,
      }
    );
  }

  animateOut() {
    const animation = this.element.animate(
      [{ opacity: 0, transform: "translateX(250px)" }],
      {
        duration: 250,
      }
    );
    // wait for animation to finish
    animation.onfinish = () => {
      this.element.remove();
    };
  }

  show() {
    this.timeoutId = setTimeout(() => {
      this.animateOut();
      this.timeoutId = null;
    }, this.duration);
  }

  dismiss() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      this.animateOut();
    }
  }
}
