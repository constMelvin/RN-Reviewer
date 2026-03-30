import {
  require_shim,
  require_with_selector
} from "./chunk-TQRAVTWD.js";
import {
  require_react_dom
} from "./chunk-SBGGKNCO.js";
import {
  require_jsx_runtime
} from "./chunk-Q3WKDQIH.js";
import {
  require_react
} from "./chunk-VPEBV5N7.js";
import {
  __export,
  __publicField,
  __toESM
} from "./chunk-SNAQBZPT.js";

// node_modules/@base-ui/react/esm/alert-dialog/index.parts.js
var index_parts_exports = {};
__export(index_parts_exports, {
  Backdrop: () => DialogBackdrop,
  Close: () => DialogClose,
  Description: () => DialogDescription,
  Handle: () => DialogHandle,
  Popup: () => DialogPopup,
  Portal: () => DialogPortal,
  Root: () => AlertDialogRoot,
  Title: () => DialogTitle,
  Trigger: () => DialogTrigger,
  Viewport: () => DialogViewport,
  createHandle: () => createAlertDialogHandle
});

// node_modules/@base-ui/react/esm/alert-dialog/root/AlertDialogRoot.js
var React42 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/useRefWithInit.js
var React = __toESM(require_react());
var UNINITIALIZED = {};
function useRefWithInit(init, initArg) {
  const ref = React.useRef(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }
  return ref;
}

// node_modules/@base-ui/react/esm/dialog/root/useDialogRoot.js
var React39 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/useStableCallback.js
var React2 = __toESM(require_react(), 1);
var useInsertionEffect = React2[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0, -3)];
var useSafeInsertionEffect = (
  // React 17 doesn't have useInsertionEffect.
  useInsertionEffect && // Preact replaces useInsertionEffect with useLayoutEffect and fires too late.
  useInsertionEffect !== React2.useLayoutEffect ? useInsertionEffect : (fn) => fn()
);
function useStableCallback(callback) {
  const stable = useRefWithInit(createStableCallback).current;
  stable.next = callback;
  useSafeInsertionEffect(stable.effect);
  return stable.trampoline;
}
function createStableCallback() {
  const stable = {
    next: void 0,
    callback: assertNotCalled,
    trampoline: (...args) => {
      var _a;
      return (_a = stable.callback) == null ? void 0 : _a.call(stable, ...args);
    },
    effect: () => {
      stable.callback = stable.next;
    }
  };
  return stable;
}
function assertNotCalled() {
  if (true) {
    throw (
      /* minify-error-disabled */
      new Error("Base UI: Cannot call an event handler while rendering.")
    );
  }
}

// node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle2(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
var isWebKitValue;
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}

// node_modules/@base-ui/utils/esm/detectBrowser.js
var hasNavigator = typeof navigator !== "undefined";
var nav = getNavigatorData();
var platform = getPlatform();
var userAgent = getUserAgent();
var isWebKit2 = typeof CSS === "undefined" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter:none");
var isIOS = (
  // iPads can claim to be MacIntel
  nav.platform === "MacIntel" && nav.maxTouchPoints > 1 ? true : /iP(hone|ad|od)|iOS/.test(nav.platform)
);
var isFirefox = hasNavigator && /firefox/i.test(userAgent);
var isSafari = hasNavigator && /apple/i.test(navigator.vendor);
var isEdge = hasNavigator && /Edg/i.test(userAgent);
var isAndroid = hasNavigator && /android/i.test(platform) || /android/i.test(userAgent);
var isMac = hasNavigator && platform.toLowerCase().startsWith("mac") && !navigator.maxTouchPoints;
var isJSDOM = userAgent.includes("jsdom/");
function getNavigatorData() {
  if (!hasNavigator) {
    return {
      platform: "",
      maxTouchPoints: -1
    };
  }
  const uaData = navigator.userAgentData;
  if (uaData == null ? void 0 : uaData.platform) {
    return {
      platform: uaData.platform,
      maxTouchPoints: navigator.maxTouchPoints
    };
  }
  return {
    platform: navigator.platform ?? "",
    maxTouchPoints: navigator.maxTouchPoints ?? -1
  };
}
function getUserAgent() {
  if (!hasNavigator) {
    return "";
  }
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    return uaData.brands.map(({
      brand,
      version: version2
    }) => `${brand}/${version2}`).join(" ");
  }
  return navigator.userAgent;
}
function getPlatform() {
  if (!hasNavigator) {
    return "";
  }
  const uaData = navigator.userAgentData;
  if (uaData == null ? void 0 : uaData.platform) {
    return uaData.platform;
  }
  return navigator.platform ?? "";
}

// node_modules/@base-ui/utils/esm/owner.js
function ownerDocument(node) {
  return (node == null ? void 0 : node.ownerDocument) || document;
}

// node_modules/@base-ui/utils/esm/useIsoLayoutEffect.js
var React3 = __toESM(require_react(), 1);
var noop = () => {
};
var useIsoLayoutEffect = typeof document !== "undefined" ? React3.useLayoutEffect : noop;

// node_modules/@base-ui/utils/esm/useOnMount.js
var React4 = __toESM(require_react(), 1);
var EMPTY = [];
function useOnMount(fn) {
  React4.useEffect(fn, EMPTY);
}

// node_modules/@base-ui/utils/esm/useTimeout.js
var EMPTY2 = 0;
var Timeout = class _Timeout {
  constructor() {
    __publicField(this, "currentId", EMPTY2);
    __publicField(this, "clear", () => {
      if (this.currentId !== EMPTY2) {
        clearTimeout(this.currentId);
        this.currentId = EMPTY2;
      }
    });
    __publicField(this, "disposeEffect", () => {
      return this.clear;
    });
  }
  static create() {
    return new _Timeout();
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  start(delay, fn) {
    this.clear();
    this.currentId = setTimeout(() => {
      this.currentId = EMPTY2;
      fn();
    }, delay);
  }
  isStarted() {
    return this.currentId !== EMPTY2;
  }
};
function useTimeout() {
  const timeout = useRefWithInit(Timeout.create).current;
  useOnMount(timeout.disposeEffect);
  return timeout;
}

// node_modules/@base-ui/utils/esm/useAnimationFrame.js
var EMPTY3 = null;
var LAST_RAF = globalThis.requestAnimationFrame;
var Scheduler = class {
  constructor() {
    /* This implementation uses an array as a backing data-structure for frame callbacks.
     * It allows `O(1)` callback cancelling by inserting a `null` in the array, though it
     * never calls the native `cancelAnimationFrame` if there are no frames left. This can
     * be much more efficient if there is a call pattern that alterns as
     * "request-cancel-request-cancel-…".
     * But in the case of "request-request-…-cancel-cancel-…", it leaves the final animation
     * frame to run anyway. We turn that frame into a `O(1)` no-op via `callbacksCount`. */
    __publicField(this, "callbacks", []);
    __publicField(this, "callbacksCount", 0);
    __publicField(this, "nextId", 1);
    __publicField(this, "startId", 1);
    __publicField(this, "isScheduled", false);
    __publicField(this, "tick", (timestamp) => {
      var _a;
      this.isScheduled = false;
      const currentCallbacks = this.callbacks;
      const currentCallbacksCount = this.callbacksCount;
      this.callbacks = [];
      this.callbacksCount = 0;
      this.startId = this.nextId;
      if (currentCallbacksCount > 0) {
        for (let i = 0; i < currentCallbacks.length; i += 1) {
          (_a = currentCallbacks[i]) == null ? void 0 : _a.call(currentCallbacks, timestamp);
        }
      }
    });
  }
  request(fn) {
    const id = this.nextId;
    this.nextId += 1;
    this.callbacks.push(fn);
    this.callbacksCount += 1;
    const didRAFChange = LAST_RAF !== requestAnimationFrame && (LAST_RAF = requestAnimationFrame, true);
    if (!this.isScheduled || didRAFChange) {
      requestAnimationFrame(this.tick);
      this.isScheduled = true;
    }
    return id;
  }
  cancel(id) {
    const index = id - this.startId;
    if (index < 0 || index >= this.callbacks.length) {
      return;
    }
    this.callbacks[index] = null;
    this.callbacksCount -= 1;
  }
};
var scheduler = new Scheduler();
var AnimationFrame = class _AnimationFrame {
  constructor() {
    __publicField(this, "currentId", EMPTY3);
    __publicField(this, "cancel", () => {
      if (this.currentId !== EMPTY3) {
        scheduler.cancel(this.currentId);
        this.currentId = EMPTY3;
      }
    });
    __publicField(this, "disposeEffect", () => {
      return this.cancel;
    });
  }
  static create() {
    return new _AnimationFrame();
  }
  static request(fn) {
    return scheduler.request(fn);
  }
  static cancel(id) {
    return scheduler.cancel(id);
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  request(fn) {
    this.cancel();
    this.currentId = scheduler.request(() => {
      this.currentId = EMPTY3;
      fn();
    });
  }
};
function useAnimationFrame() {
  const timeout = useRefWithInit(AnimationFrame.create).current;
  useOnMount(timeout.disposeEffect);
  return timeout;
}

// node_modules/@base-ui/utils/esm/empty.js
function NOOP() {
}
var EMPTY_ARRAY = Object.freeze([]);
var EMPTY_OBJECT = Object.freeze({});

// node_modules/@base-ui/utils/esm/useScrollLock.js
var originalHtmlStyles = {};
var originalBodyStyles = {};
var originalHtmlScrollBehavior = "";
function hasInsetScrollbars(referenceElement) {
  if (typeof document === "undefined") {
    return false;
  }
  const doc = ownerDocument(referenceElement);
  const win = getWindow(doc);
  return win.innerWidth - doc.documentElement.clientWidth > 0;
}
function supportsStableScrollbarGutter(referenceElement) {
  const supported = typeof CSS !== "undefined" && CSS.supports && CSS.supports("scrollbar-gutter", "stable");
  if (!supported || typeof document === "undefined") {
    return false;
  }
  const doc = ownerDocument(referenceElement);
  const html = doc.documentElement;
  const body = doc.body;
  const scrollContainer = isOverflowElement(html) ? html : body;
  const originalScrollContainerOverflowY = scrollContainer.style.overflowY;
  const originalHtmlStyleGutter = html.style.scrollbarGutter;
  html.style.scrollbarGutter = "stable";
  scrollContainer.style.overflowY = "scroll";
  const before = scrollContainer.offsetWidth;
  scrollContainer.style.overflowY = "hidden";
  const after = scrollContainer.offsetWidth;
  scrollContainer.style.overflowY = originalScrollContainerOverflowY;
  html.style.scrollbarGutter = originalHtmlStyleGutter;
  return before === after;
}
function preventScrollOverlayScrollbars(referenceElement) {
  const doc = ownerDocument(referenceElement);
  const html = doc.documentElement;
  const body = doc.body;
  const elementToLock = isOverflowElement(html) ? html : body;
  const originalElementToLockStyles = {
    overflowY: elementToLock.style.overflowY,
    overflowX: elementToLock.style.overflowX
  };
  Object.assign(elementToLock.style, {
    overflowY: "hidden",
    overflowX: "hidden"
  });
  return () => {
    Object.assign(elementToLock.style, originalElementToLockStyles);
  };
}
function preventScrollInsetScrollbars(referenceElement) {
  var _a;
  const doc = ownerDocument(referenceElement);
  const html = doc.documentElement;
  const body = doc.body;
  const win = getWindow(html);
  let scrollTop = 0;
  let scrollLeft = 0;
  let updateGutterOnly = false;
  const resizeFrame = AnimationFrame.create();
  if (isWebKit2 && (((_a = win.visualViewport) == null ? void 0 : _a.scale) ?? 1) !== 1) {
    return () => {
    };
  }
  function lockScroll() {
    const htmlStyles = win.getComputedStyle(html);
    const bodyStyles = win.getComputedStyle(body);
    const htmlScrollbarGutterValue = htmlStyles.scrollbarGutter || "";
    const hasBothEdges = htmlScrollbarGutterValue.includes("both-edges");
    const scrollbarGutterValue = hasBothEdges ? "stable both-edges" : "stable";
    scrollTop = html.scrollTop;
    scrollLeft = html.scrollLeft;
    originalHtmlStyles = {
      scrollbarGutter: html.style.scrollbarGutter,
      overflowY: html.style.overflowY,
      overflowX: html.style.overflowX
    };
    originalHtmlScrollBehavior = html.style.scrollBehavior;
    originalBodyStyles = {
      position: body.style.position,
      height: body.style.height,
      width: body.style.width,
      boxSizing: body.style.boxSizing,
      overflowY: body.style.overflowY,
      overflowX: body.style.overflowX,
      scrollBehavior: body.style.scrollBehavior
    };
    const isScrollableY = html.scrollHeight > html.clientHeight;
    const isScrollableX = html.scrollWidth > html.clientWidth;
    const hasConstantOverflowY = htmlStyles.overflowY === "scroll" || bodyStyles.overflowY === "scroll";
    const hasConstantOverflowX = htmlStyles.overflowX === "scroll" || bodyStyles.overflowX === "scroll";
    const scrollbarWidth = Math.max(0, win.innerWidth - body.clientWidth);
    const scrollbarHeight = Math.max(0, win.innerHeight - body.clientHeight);
    const marginY = parseFloat(bodyStyles.marginTop) + parseFloat(bodyStyles.marginBottom);
    const marginX = parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight);
    const elementToLock = isOverflowElement(html) ? html : body;
    updateGutterOnly = supportsStableScrollbarGutter(referenceElement);
    if (updateGutterOnly) {
      html.style.scrollbarGutter = scrollbarGutterValue;
      elementToLock.style.overflowY = "hidden";
      elementToLock.style.overflowX = "hidden";
      return;
    }
    Object.assign(html.style, {
      scrollbarGutter: scrollbarGutterValue,
      overflowY: "hidden",
      overflowX: "hidden"
    });
    if (isScrollableY || hasConstantOverflowY) {
      html.style.overflowY = "scroll";
    }
    if (isScrollableX || hasConstantOverflowX) {
      html.style.overflowX = "scroll";
    }
    Object.assign(body.style, {
      position: "relative",
      height: marginY || scrollbarHeight ? `calc(100dvh - ${marginY + scrollbarHeight}px)` : "100dvh",
      width: marginX || scrollbarWidth ? `calc(100vw - ${marginX + scrollbarWidth}px)` : "100vw",
      boxSizing: "border-box",
      overflow: "hidden",
      scrollBehavior: "unset"
    });
    body.scrollTop = scrollTop;
    body.scrollLeft = scrollLeft;
    html.setAttribute("data-base-ui-scroll-locked", "");
    html.style.scrollBehavior = "unset";
  }
  function cleanup() {
    Object.assign(html.style, originalHtmlStyles);
    Object.assign(body.style, originalBodyStyles);
    if (!updateGutterOnly) {
      html.scrollTop = scrollTop;
      html.scrollLeft = scrollLeft;
      html.removeAttribute("data-base-ui-scroll-locked");
      html.style.scrollBehavior = originalHtmlScrollBehavior;
    }
  }
  function handleResize() {
    cleanup();
    resizeFrame.request(lockScroll);
  }
  lockScroll();
  win.addEventListener("resize", handleResize);
  return () => {
    resizeFrame.cancel();
    cleanup();
    if (typeof win.removeEventListener === "function") {
      win.removeEventListener("resize", handleResize);
    }
  };
}
var ScrollLocker = class {
  constructor() {
    __publicField(this, "lockCount", 0);
    __publicField(this, "restore", null);
    __publicField(this, "timeoutLock", Timeout.create());
    __publicField(this, "timeoutUnlock", Timeout.create());
    __publicField(this, "release", () => {
      this.lockCount -= 1;
      if (this.lockCount === 0 && this.restore) {
        this.timeoutUnlock.start(0, this.unlock);
      }
    });
    __publicField(this, "unlock", () => {
      var _a;
      if (this.lockCount === 0 && this.restore) {
        (_a = this.restore) == null ? void 0 : _a.call(this);
        this.restore = null;
      }
    });
  }
  acquire(referenceElement) {
    this.lockCount += 1;
    if (this.lockCount === 1 && this.restore === null) {
      this.timeoutLock.start(0, () => this.lock(referenceElement));
    }
    return this.release;
  }
  lock(referenceElement) {
    if (this.lockCount === 0 || this.restore !== null) {
      return;
    }
    const doc = ownerDocument(referenceElement);
    const html = doc.documentElement;
    const htmlOverflowY = getWindow(html).getComputedStyle(html).overflowY;
    if (htmlOverflowY === "hidden" || htmlOverflowY === "clip") {
      this.restore = NOOP;
      return;
    }
    const hasOverlayScrollbars = isIOS || !hasInsetScrollbars(referenceElement);
    this.restore = hasOverlayScrollbars ? preventScrollOverlayScrollbars(referenceElement) : preventScrollInsetScrollbars(referenceElement);
  }
};
var SCROLL_LOCKER = new ScrollLocker();
function useScrollLock(enabled = true, referenceElement = null) {
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return void 0;
    }
    return SCROLL_LOCKER.acquire(referenceElement);
  }, [enabled, referenceElement]);
}

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingDelayGroup.js
var React5 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/utils/constants.js
var FOCUSABLE_ATTRIBUTE = "data-base-ui-focusable";
var ACTIVE_KEY = "active";
var SELECTED_KEY = "selected";
var TYPEABLE_SELECTOR = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";

// node_modules/@base-ui/react/esm/floating-ui-react/utils/element.js
function activeElement(doc) {
  var _a;
  let element = doc.activeElement;
  while (((_a = element == null ? void 0 : element.shadowRoot) == null ? void 0 : _a.activeElement) != null) {
    element = element.shadowRoot.activeElement;
  }
  return element;
}
function contains(parent, child) {
  var _a;
  if (!parent || !child) {
    return false;
  }
  const rootNode = (_a = child.getRootNode) == null ? void 0 : _a.call(child);
  if (parent.contains(child)) {
    return true;
  }
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    }
  }
  return false;
}
function getTarget(event) {
  if ("composedPath" in event) {
    return event.composedPath()[0];
  }
  return event.target;
}
function isEventTargetWithin(event, node) {
  if (node == null) {
    return false;
  }
  if ("composedPath" in event) {
    return event.composedPath().includes(node);
  }
  const eventAgain = event;
  return eventAgain.target != null && node.contains(eventAgain.target);
}
function isRootElement(element) {
  return element.matches("html,body");
}
function isTypeableElement(element) {
  return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
}
function isTypeableCombobox(element) {
  if (!element) {
    return false;
  }
  return element.getAttribute("role") === "combobox" && isTypeableElement(element);
}
function getFloatingFocusElement(floatingElement) {
  if (!floatingElement) {
    return null;
  }
  return floatingElement.hasAttribute(FOCUSABLE_ATTRIBUTE) ? floatingElement : floatingElement.querySelector(`[${FOCUSABLE_ATTRIBUTE}]`) || floatingElement;
}

// node_modules/@base-ui/react/esm/floating-ui-react/utils/nodes.js
function getNodeChildren(nodes, id, onlyOpenChildren = true) {
  const directChildren = nodes.filter((node) => {
    var _a;
    return node.parentId === id && (!onlyOpenChildren || ((_a = node.context) == null ? void 0 : _a.open));
  });
  return directChildren.flatMap((child) => [child, ...getNodeChildren(nodes, child.id, onlyOpenChildren)]);
}
function getNodeAncestors(nodes, id) {
  var _a;
  let allAncestors = [];
  let currentParentId = (_a = nodes.find((node) => node.id === id)) == null ? void 0 : _a.parentId;
  while (currentParentId) {
    const currentNode = nodes.find((node) => node.id === currentParentId);
    currentParentId = currentNode == null ? void 0 : currentNode.parentId;
    if (currentNode) {
      allAncestors = allAncestors.concat(currentNode);
    }
  }
  return allAncestors;
}

// node_modules/@base-ui/react/esm/floating-ui-react/utils/event.js
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
function isReactEvent(event) {
  return "nativeEvent" in event;
}
function isVirtualClick(event) {
  if (event.pointerType === "" && event.isTrusted) {
    return true;
  }
  if (isAndroid && event.pointerType) {
    return event.type === "click" && event.buttons === 1;
  }
  return event.detail === 0 && !event.pointerType;
}
function isVirtualPointerEvent(event) {
  if (isJSDOM) {
    return false;
  }
  return !isAndroid && event.width === 0 && event.height === 0 || isAndroid && event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "mouse" || // iOS VoiceOver returns 0.333• for width/height.
  event.width < 1 && event.height < 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "touch";
}
function isMouseLikePointerType(pointerType, strict) {
  const values = ["mouse", "pen"];
  if (!strict) {
    values.push("", void 0);
  }
  return values.includes(pointerType);
}
function isClickLikeEvent(event) {
  const type = event.type;
  return type === "click" || type === "mousedown" || type === "keydown" || type === "keyup";
}

// node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var sides = ["top", "right", "bottom", "left"];
var alignments = ["start", "end"];
var placements = sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
var createCoords = (v) => ({
  x: v,
  y: v
});

// node_modules/@base-ui/react/esm/floating-ui-react/utils/composite.js
function isElementVisible(element) {
  return getComputedStyle2(element).display !== "none";
}

// node_modules/tabbable/dist/index.esm.js
var candidateSelectors = ["input:not([inert]):not([inert] *)", "select:not([inert]):not([inert] *)", "textarea:not([inert]):not([inert] *)", "a[href]:not([inert]):not([inert] *)", "button:not([inert]):not([inert] *)", "[tabindex]:not(slot):not([inert]):not([inert] *)", "audio[controls]:not([inert]):not([inert] *)", "video[controls]:not([inert]):not([inert] *)", '[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)', "details>summary:first-of-type:not([inert]):not([inert] *)", "details:not([inert]):not([inert] *)"];
var candidateSelector = candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
var _isInert = function isInert(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
  var inert = inertAtt === "" || inertAtt === "true";
  var result = inert || lookUp && node && // closest does not exist on shadow roots, so we fall back to a manual
  // lookup upward, in case it is not defined.
  (typeof node.closest === "function" ? node.closest("[inert]") : _isInert(node.parentNode));
  return result;
};
var isContentEditable = function isContentEditable2(node) {
  var _node$getAttribute2;
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
  return attValue === "" || attValue === "true";
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  if (_isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var _getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (_isInert(element, false)) {
      continue;
    }
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = _getCandidatesIteratively(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !_isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = _getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var hasTabIndex = function hasTabIndex2(node) {
  return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
var getTabIndex = function getTabIndex2(node) {
  if (!node) {
    throw new Error("No node provided");
  }
  if (node.tabIndex < 0) {
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached2(node) {
  var _nodeRoot;
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (displayCheck === "full-native") {
    if ("checkVisibility" in node) {
      var visible = node.checkVisibility({
        // Checking opacity might be desirable for some use cases, but natively,
        // opacity zero elements _are_ focusable and tabbable.
        checkOpacity: false,
        opacityProperty: false,
        contentVisibilityAuto: true,
        visibilityProperty: true,
        // This is an alias for `visibilityProperty`. Contemporary browsers
        // support both. However, this alias has wider browser support (Chrome
        // >= 105 and Firefox >= 106, vs. Chrome >= 121 and Firefox >= 122), so
        // we include it anyway.
        checkVisibilityCSS: true
      });
      return !visible;
    }
  }
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  if (!displayCheck || displayCheck === "full" || // full-native can run this branch when it falls through in case
  // Element#checkVisibility is unsupported
  displayCheck === "full-native" || displayCheck === "legacy-full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (isNodeAttached(node)) {
      return !node.getClientRects().length;
    }
    if (displayCheck !== "legacy-full") {
      return true;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isShadowRootTabbable = function isShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var _sortByOrder = function sortByOrder(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? _sortByOrder(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = _getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return _sortByOrder(candidates);
};
var focusable = function focusable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = _getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = candidateSelectors.concat("iframe:not([inert]):not([inert] *)").join(",");

// node_modules/@base-ui/react/esm/floating-ui-react/utils/tabbable.js
var getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck: (
    // JSDOM does not support the `tabbable` library. To solve this we can
    // check if `ResizeObserver` is a real function (not polyfilled), which
    // determines if the current environment is JSDOM-like.
    typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
  )
});
function getTabbableIn(container, dir) {
  const list = tabbable(container, getTabbableOptions());
  const len = list.length;
  if (len === 0) {
    return void 0;
  }
  const active = activeElement(ownerDocument(container));
  const index = list.indexOf(active);
  const nextIndex = index === -1 ? dir === 1 ? 0 : len - 1 : index + dir;
  return list[nextIndex];
}
function getNextTabbable(referenceElement) {
  return getTabbableIn(ownerDocument(referenceElement).body, 1) || referenceElement;
}
function getPreviousTabbable(referenceElement) {
  return getTabbableIn(ownerDocument(referenceElement).body, -1) || referenceElement;
}
function isOutsideEvent(event, container) {
  const containerElement = container || event.currentTarget;
  const relatedTarget = event.relatedTarget;
  return !relatedTarget || !contains(containerElement, relatedTarget);
}
function disableFocusInside(container) {
  const tabbableElements = tabbable(container, getTabbableOptions());
  tabbableElements.forEach((element) => {
    element.dataset.tabindex = element.getAttribute("tabindex") || "";
    element.setAttribute("tabindex", "-1");
  });
}
function enableFocusInside(container) {
  const elements = container.querySelectorAll("[data-tabindex]");
  elements.forEach((element) => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute("tabindex", tabindex);
    } else {
      element.removeAttribute("tabindex");
    }
  });
}

// node_modules/@base-ui/react/esm/utils/constants.js
var CLICK_TRIGGER_IDENTIFIER = "data-base-ui-click-trigger";
var BASE_UI_SWIPE_IGNORE_ATTRIBUTE = "data-base-ui-swipe-ignore";
var LEGACY_SWIPE_IGNORE_ATTRIBUTE = "data-swipe-ignore";
var BASE_UI_SWIPE_IGNORE_SELECTOR = `[${BASE_UI_SWIPE_IGNORE_ATTRIBUTE}]`;
var LEGACY_SWIPE_IGNORE_SELECTOR = `[${LEGACY_SWIPE_IGNORE_ATTRIBUTE}]`;
var ownerVisuallyHidden = {
  clipPath: "inset(50%)",
  position: "fixed",
  top: 0,
  left: 0
};

// node_modules/@base-ui/react/esm/utils/reason-parts.js
var reason_parts_exports = {};
__export(reason_parts_exports, {
  cancelOpen: () => cancelOpen,
  chipRemovePress: () => chipRemovePress,
  clearPress: () => clearPress,
  closePress: () => closePress,
  closeWatcher: () => closeWatcher,
  decrementPress: () => decrementPress,
  disabled: () => disabled,
  drag: () => drag,
  escapeKey: () => escapeKey,
  focusOut: () => focusOut,
  imperativeAction: () => imperativeAction,
  incrementPress: () => incrementPress,
  inputBlur: () => inputBlur,
  inputChange: () => inputChange,
  inputClear: () => inputClear,
  inputPaste: () => inputPaste,
  inputPress: () => inputPress,
  itemPress: () => itemPress,
  keyboard: () => keyboard,
  linkPress: () => linkPress,
  listNavigation: () => listNavigation,
  none: () => none,
  outsidePress: () => outsidePress,
  pointer: () => pointer,
  scrub: () => scrub,
  siblingOpen: () => siblingOpen,
  swipe: () => swipe,
  trackPress: () => trackPress,
  triggerFocus: () => triggerFocus,
  triggerHover: () => triggerHover,
  triggerPress: () => triggerPress,
  wheel: () => wheel,
  windowResize: () => windowResize
});
var none = "none";
var triggerPress = "trigger-press";
var triggerHover = "trigger-hover";
var triggerFocus = "trigger-focus";
var outsidePress = "outside-press";
var itemPress = "item-press";
var closePress = "close-press";
var linkPress = "link-press";
var clearPress = "clear-press";
var chipRemovePress = "chip-remove-press";
var trackPress = "track-press";
var incrementPress = "increment-press";
var decrementPress = "decrement-press";
var inputChange = "input-change";
var inputClear = "input-clear";
var inputBlur = "input-blur";
var inputPaste = "input-paste";
var inputPress = "input-press";
var focusOut = "focus-out";
var escapeKey = "escape-key";
var closeWatcher = "close-watcher";
var listNavigation = "list-navigation";
var keyboard = "keyboard";
var pointer = "pointer";
var drag = "drag";
var wheel = "wheel";
var scrub = "scrub";
var cancelOpen = "cancel-open";
var siblingOpen = "sibling-open";
var disabled = "disabled";
var imperativeAction = "imperative-action";
var swipe = "swipe";
var windowResize = "window-resize";

// node_modules/@base-ui/react/esm/utils/createBaseUIEventDetails.js
function createChangeEventDetails(reason, event, trigger, customProperties) {
  let canceled = false;
  let allowPropagation = false;
  const custom = customProperties ?? EMPTY_OBJECT;
  const details = {
    reason,
    event: event ?? new Event("base-ui"),
    cancel() {
      canceled = true;
    },
    allowPropagation() {
      allowPropagation = true;
    },
    get isCanceled() {
      return canceled;
    },
    get isPropagationAllowed() {
      return allowPropagation;
    },
    trigger,
    ...custom
  };
  return details;
}

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingDelayGroup.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var FloatingDelayGroupContext = React5.createContext({
  hasProvider: false,
  timeoutMs: 0,
  delayRef: {
    current: 0
  },
  initialDelayRef: {
    current: 0
  },
  timeout: new Timeout(),
  currentIdRef: {
    current: null
  },
  currentContextRef: {
    current: null
  }
});
if (true) FloatingDelayGroupContext.displayName = "FloatingDelayGroupContext";

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingFocusManager.js
var React14 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/useMergedRefs.js
function useMergedRefs(a, b, c, d) {
  const forkRef = useRefWithInit(createForkRef).current;
  if (didChange(forkRef, a, b, c, d)) {
    update(forkRef, [a, b, c, d]);
  }
  return forkRef.callback;
}
function useMergedRefsN(refs) {
  const forkRef = useRefWithInit(createForkRef).current;
  if (didChangeN(forkRef, refs)) {
    update(forkRef, refs);
  }
  return forkRef.callback;
}
function createForkRef() {
  return {
    callback: null,
    cleanup: null,
    refs: []
  };
}
function didChange(forkRef, a, b, c, d) {
  return forkRef.refs[0] !== a || forkRef.refs[1] !== b || forkRef.refs[2] !== c || forkRef.refs[3] !== d;
}
function didChangeN(forkRef, newRefs) {
  return forkRef.refs.length !== newRefs.length || forkRef.refs.some((ref, index) => ref !== newRefs[index]);
}
function update(forkRef, refs) {
  forkRef.refs = refs;
  if (refs.every((ref) => ref == null)) {
    forkRef.callback = null;
    return;
  }
  forkRef.callback = (instance) => {
    if (forkRef.cleanup) {
      forkRef.cleanup();
      forkRef.cleanup = null;
    }
    if (instance != null) {
      const cleanupCallbacks = Array(refs.length).fill(null);
      for (let i = 0; i < refs.length; i += 1) {
        const ref = refs[i];
        if (ref == null) {
          continue;
        }
        switch (typeof ref) {
          case "function": {
            const refCleanup = ref(instance);
            if (typeof refCleanup === "function") {
              cleanupCallbacks[i] = refCleanup;
            }
            break;
          }
          case "object": {
            ref.current = instance;
            break;
          }
          default:
        }
      }
      forkRef.cleanup = () => {
        for (let i = 0; i < refs.length; i += 1) {
          const ref = refs[i];
          if (ref == null) {
            continue;
          }
          switch (typeof ref) {
            case "function": {
              const cleanupCallback = cleanupCallbacks[i];
              if (typeof cleanupCallback === "function") {
                cleanupCallback();
              } else {
                ref(null);
              }
              break;
            }
            case "object": {
              ref.current = null;
              break;
            }
            default:
          }
        }
      };
    }
  };
}

// node_modules/@base-ui/utils/esm/useValueAsRef.js
function useValueAsRef(value) {
  const latest = useRefWithInit(createLatestRef, value).current;
  latest.next = value;
  useIsoLayoutEffect(latest.effect);
  return latest;
}
function createLatestRef(value) {
  const latest = {
    current: value,
    next: value,
    effect: () => {
      latest.current = latest.next;
    }
  };
  return latest;
}

// node_modules/@base-ui/react/esm/utils/FocusGuard.js
var React6 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/visuallyHidden.js
var visuallyHiddenBase = {
  clipPath: "inset(50%)",
  overflow: "hidden",
  whiteSpace: "nowrap",
  border: 0,
  padding: 0,
  width: 1,
  height: 1,
  margin: -1
};
var visuallyHidden = {
  ...visuallyHiddenBase,
  position: "fixed",
  top: 0,
  left: 0
};
var visuallyHiddenInput = {
  ...visuallyHiddenBase,
  position: "absolute"
};

// node_modules/@base-ui/react/esm/utils/FocusGuard.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var FocusGuard = React6.forwardRef(function FocusGuard2(props, ref) {
  const [role, setRole] = React6.useState();
  useIsoLayoutEffect(() => {
    if (isSafari) {
      setRole("button");
    }
  }, []);
  const restProps = {
    tabIndex: 0,
    // Role is only for VoiceOver
    role
  };
  return (0, import_jsx_runtime2.jsx)("span", {
    ...props,
    ref,
    style: visuallyHidden,
    "aria-hidden": role ? void 0 : true,
    ...restProps,
    "data-base-ui-focus-guard": ""
  });
});
if (true) FocusGuard.displayName = "FocusGuard";

// node_modules/@base-ui/react/esm/floating-ui-react/utils/createAttribute.js
function createAttribute(name) {
  return `data-base-ui-${name}`;
}

// node_modules/@base-ui/react/esm/floating-ui-react/utils/enqueueFocus.js
var rafId = 0;
function enqueueFocus(el, options = {}) {
  const {
    preventScroll = false,
    cancelPrevious = true,
    sync = false
  } = options;
  if (cancelPrevious) {
    cancelAnimationFrame(rafId);
  }
  const exec = () => el == null ? void 0 : el.focus({
    preventScroll
  });
  if (sync) {
    exec();
  } else {
    rafId = requestAnimationFrame(exec);
  }
}

// node_modules/@base-ui/react/esm/floating-ui-react/utils/markOthers.js
var counters = {
  inert: /* @__PURE__ */ new WeakMap(),
  "aria-hidden": /* @__PURE__ */ new WeakMap()
};
var markerName = "data-base-ui-inert";
var uncontrolledElementsSets = {
  inert: /* @__PURE__ */ new WeakSet(),
  "aria-hidden": /* @__PURE__ */ new WeakSet()
};
var markerCounterMap = /* @__PURE__ */ new WeakMap();
var lockCount = 0;
function getUncontrolledElementsSet(controlAttribute) {
  return uncontrolledElementsSets[controlAttribute];
}
function unwrapHost(node) {
  if (!node) {
    return null;
  }
  return isShadowRoot(node) ? node.host : unwrapHost(node.parentNode);
}
var correctElements = (parent, targets) => targets.map((target) => {
  if (parent.contains(target)) {
    return target;
  }
  const correctedTarget = unwrapHost(target);
  if (parent.contains(correctedTarget)) {
    return correctedTarget;
  }
  return null;
}).filter((x) => x != null);
var buildKeepSet = (targets) => {
  const keep = /* @__PURE__ */ new Set();
  targets.forEach((target) => {
    let node = target;
    while (node && !keep.has(node)) {
      keep.add(node);
      node = node.parentNode;
    }
  });
  return keep;
};
var collectOutsideElements = (root, keepElements, stopElements) => {
  const outside = [];
  const walk = (parent) => {
    if (!parent || stopElements.has(parent)) {
      return;
    }
    Array.from(parent.children).forEach((node) => {
      if (getNodeName(node) === "script") {
        return;
      }
      if (keepElements.has(node)) {
        walk(node);
      } else {
        outside.push(node);
      }
    });
  };
  walk(root);
  return outside;
};
function applyAttributeToOthers(uncorrectedAvoidElements, body, ariaHidden, inert, {
  mark = true,
  markerIgnoreElements = []
}) {
  const controlAttribute = inert ? "inert" : ariaHidden ? "aria-hidden" : null;
  let counterMap = null;
  let uncontrolledElementsSet = null;
  const avoidElements = correctElements(body, uncorrectedAvoidElements);
  const markerIgnoreTargets = mark ? correctElements(body, markerIgnoreElements) : [];
  const markerIgnoreSet = new Set(markerIgnoreTargets);
  const markerTargets = mark ? collectOutsideElements(body, buildKeepSet(avoidElements), new Set(avoidElements)).filter((target) => !markerIgnoreSet.has(target)) : [];
  const hiddenElements = [];
  const markedElements = [];
  if (controlAttribute) {
    const map = counters[controlAttribute];
    const currentUncontrolledElementsSet = getUncontrolledElementsSet(controlAttribute);
    uncontrolledElementsSet = currentUncontrolledElementsSet;
    counterMap = map;
    const ariaLiveElements = correctElements(body, Array.from(body.querySelectorAll("[aria-live]")));
    const controlElements = avoidElements.concat(ariaLiveElements);
    const controlTargets = collectOutsideElements(body, buildKeepSet(controlElements), new Set(controlElements));
    controlTargets.forEach((node) => {
      const attr2 = node.getAttribute(controlAttribute);
      const alreadyHidden = attr2 !== null && attr2 !== "false";
      const counterValue = (map.get(node) || 0) + 1;
      map.set(node, counterValue);
      hiddenElements.push(node);
      if (counterValue === 1 && alreadyHidden) {
        currentUncontrolledElementsSet.add(node);
      }
      if (!alreadyHidden) {
        node.setAttribute(controlAttribute, controlAttribute === "inert" ? "" : "true");
      }
    });
  }
  if (mark) {
    markerTargets.forEach((node) => {
      const markerValue = (markerCounterMap.get(node) || 0) + 1;
      markerCounterMap.set(node, markerValue);
      markedElements.push(node);
      if (markerValue === 1) {
        node.setAttribute(markerName, "");
      }
    });
  }
  lockCount += 1;
  return () => {
    if (counterMap) {
      hiddenElements.forEach((element) => {
        const currentCounterValue = counterMap.get(element) || 0;
        const counterValue = currentCounterValue - 1;
        counterMap.set(element, counterValue);
        if (!counterValue) {
          if (!(uncontrolledElementsSet == null ? void 0 : uncontrolledElementsSet.has(element)) && controlAttribute) {
            element.removeAttribute(controlAttribute);
          }
          uncontrolledElementsSet == null ? void 0 : uncontrolledElementsSet.delete(element);
        }
      });
    }
    if (mark) {
      markedElements.forEach((element) => {
        const markerValue = (markerCounterMap.get(element) || 0) - 1;
        markerCounterMap.set(element, markerValue);
        if (!markerValue) {
          element.removeAttribute(markerName);
        }
      });
    }
    lockCount -= 1;
    if (!lockCount) {
      counters.inert = /* @__PURE__ */ new WeakMap();
      counters["aria-hidden"] = /* @__PURE__ */ new WeakMap();
      uncontrolledElementsSets.inert = /* @__PURE__ */ new WeakSet();
      uncontrolledElementsSets["aria-hidden"] = /* @__PURE__ */ new WeakSet();
      markerCounterMap = /* @__PURE__ */ new WeakMap();
    }
  };
}
function markOthers(avoidElements, options = {}) {
  const {
    ariaHidden = false,
    inert = false,
    mark = true,
    markerIgnoreElements = []
  } = options;
  const body = ownerDocument(avoidElements[0]).body;
  return applyAttributeToOthers(avoidElements, body, ariaHidden, inert, {
    mark,
    markerIgnoreElements
  });
}

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingPortal.js
var React12 = __toESM(require_react(), 1);
var ReactDOM = __toESM(require_react_dom(), 1);

// node_modules/@base-ui/utils/esm/useId.js
var React8 = __toESM(require_react());

// node_modules/@base-ui/utils/esm/safeReact.js
var React7 = __toESM(require_react(), 1);
var SafeReact = {
  ...React7
};

// node_modules/@base-ui/utils/esm/useId.js
var globalId = 0;
function useGlobalId(idOverride, prefix = "mui") {
  const [defaultId, setDefaultId] = React8.useState(idOverride);
  const id = idOverride || defaultId;
  React8.useEffect(() => {
    if (defaultId == null) {
      globalId += 1;
      setDefaultId(`${prefix}-${globalId}`);
    }
  }, [defaultId, prefix]);
  return id;
}
var maybeReactUseId = SafeReact.useId;
function useId(idOverride, prefix) {
  if (maybeReactUseId !== void 0) {
    const reactId = maybeReactUseId();
    return idOverride ?? (prefix ? `${prefix}-${reactId}` : reactId);
  }
  return useGlobalId(idOverride, prefix);
}

// node_modules/@base-ui/utils/esm/formatErrorMessage.js
function createFormatErrorMessage(baseUrl, prefix) {
  return function formatErrorMessage2(code, ...args) {
    const url = new URL(baseUrl);
    url.searchParams.set("code", code.toString());
    args.forEach((arg) => url.searchParams.append("args[]", arg));
    return `${prefix} error #${code}; visit ${url} for the full message.`;
  };
}
var formatErrorMessage = createFormatErrorMessage("https://base-ui.com/production-error", "Base UI");

// node_modules/@base-ui/react/esm/utils/useRenderElement.js
var React11 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/getReactElementRef.js
var React10 = __toESM(require_react());

// node_modules/@base-ui/utils/esm/reactVersion.js
var React9 = __toESM(require_react(), 1);
var majorVersion = parseInt(React9.version, 10);
function isReactVersionAtLeast(reactVersionToCheck) {
  return majorVersion >= reactVersionToCheck;
}

// node_modules/@base-ui/utils/esm/getReactElementRef.js
function getReactElementRef(element) {
  if (!React10.isValidElement(element)) {
    return null;
  }
  const reactElement = element;
  const propsWithRef = reactElement.props;
  return (isReactVersionAtLeast(19) ? propsWithRef == null ? void 0 : propsWithRef.ref : reactElement.ref) ?? null;
}

// node_modules/@base-ui/utils/esm/mergeObjects.js
function mergeObjects(a, b) {
  if (a && !b) {
    return a;
  }
  if (!a && b) {
    return b;
  }
  if (a || b) {
    return {
      ...a,
      ...b
    };
  }
  return void 0;
}

// node_modules/@base-ui/utils/esm/warn.js
var set;
if (true) {
  set = /* @__PURE__ */ new Set();
}
function warn(...messages) {
  if (true) {
    const messageKey = messages.join(" ");
    if (!set.has(messageKey)) {
      set.add(messageKey);
      console.warn(`Base UI: ${messageKey}`);
    }
  }
}

// node_modules/@base-ui/react/esm/utils/getStateAttributesProps.js
function getStateAttributesProps(state, customMapping) {
  const props = {};
  for (const key in state) {
    const value = state[key];
    if (customMapping == null ? void 0 : customMapping.hasOwnProperty(key)) {
      const customProps = customMapping[key](value);
      if (customProps != null) {
        Object.assign(props, customProps);
      }
      continue;
    }
    if (value === true) {
      props[`data-${key.toLowerCase()}`] = "";
    } else if (value) {
      props[`data-${key.toLowerCase()}`] = value.toString();
    }
  }
  return props;
}

// node_modules/@base-ui/react/esm/utils/resolveClassName.js
function resolveClassName(className, state) {
  return typeof className === "function" ? className(state) : className;
}

// node_modules/@base-ui/react/esm/utils/resolveStyle.js
function resolveStyle(style, state) {
  return typeof style === "function" ? style(state) : style;
}

// node_modules/@base-ui/react/esm/merge-props/mergeProps.js
var EMPTY_PROPS = {};
function mergeProps(a, b, c, d, e) {
  let merged = {
    ...resolvePropsGetter(a, EMPTY_PROPS)
  };
  if (b) {
    merged = mergeOne(merged, b);
  }
  if (c) {
    merged = mergeOne(merged, c);
  }
  if (d) {
    merged = mergeOne(merged, d);
  }
  if (e) {
    merged = mergeOne(merged, e);
  }
  return merged;
}
function mergePropsN(props) {
  if (props.length === 0) {
    return EMPTY_PROPS;
  }
  if (props.length === 1) {
    return resolvePropsGetter(props[0], EMPTY_PROPS);
  }
  let merged = {
    ...resolvePropsGetter(props[0], EMPTY_PROPS)
  };
  for (let i = 1; i < props.length; i += 1) {
    merged = mergeOne(merged, props[i]);
  }
  return merged;
}
function mergeOne(merged, inputProps) {
  if (isPropsGetter(inputProps)) {
    return inputProps(merged);
  }
  return mutablyMergeInto(merged, inputProps);
}
function mutablyMergeInto(mergedProps, externalProps) {
  if (!externalProps) {
    return mergedProps;
  }
  for (const propName in externalProps) {
    const externalPropValue = externalProps[propName];
    switch (propName) {
      case "style": {
        mergedProps[propName] = mergeObjects(mergedProps.style, externalPropValue);
        break;
      }
      case "className": {
        mergedProps[propName] = mergeClassNames(mergedProps.className, externalPropValue);
        break;
      }
      default: {
        if (isEventHandler(propName, externalPropValue)) {
          mergedProps[propName] = mergeEventHandlers(mergedProps[propName], externalPropValue);
        } else {
          mergedProps[propName] = externalPropValue;
        }
      }
    }
  }
  return mergedProps;
}
function isEventHandler(key, value) {
  const code0 = key.charCodeAt(0);
  const code1 = key.charCodeAt(1);
  const code2 = key.charCodeAt(2);
  return code0 === 111 && code1 === 110 && code2 >= 65 && code2 <= 90 && (typeof value === "function" || typeof value === "undefined");
}
function isPropsGetter(inputProps) {
  return typeof inputProps === "function";
}
function resolvePropsGetter(inputProps, previousProps) {
  if (isPropsGetter(inputProps)) {
    return inputProps(previousProps);
  }
  return inputProps ?? EMPTY_PROPS;
}
function mergeEventHandlers(ourHandler, theirHandler) {
  if (!theirHandler) {
    return ourHandler;
  }
  if (!ourHandler) {
    return theirHandler;
  }
  return (event) => {
    if (isSyntheticEvent(event)) {
      const baseUIEvent = event;
      makeEventPreventable(baseUIEvent);
      const result2 = theirHandler(baseUIEvent);
      if (!baseUIEvent.baseUIHandlerPrevented) {
        ourHandler == null ? void 0 : ourHandler(baseUIEvent);
      }
      return result2;
    }
    const result = theirHandler(event);
    ourHandler == null ? void 0 : ourHandler(event);
    return result;
  };
}
function makeEventPreventable(event) {
  event.preventBaseUIHandler = () => {
    event.baseUIHandlerPrevented = true;
  };
  return event;
}
function mergeClassNames(ourClassName, theirClassName) {
  if (theirClassName) {
    if (ourClassName) {
      return theirClassName + " " + ourClassName;
    }
    return theirClassName;
  }
  return ourClassName;
}
function isSyntheticEvent(event) {
  return event != null && typeof event === "object" && "nativeEvent" in event;
}

// node_modules/@base-ui/react/esm/utils/useRenderElement.js
var import_react = __toESM(require_react(), 1);
function useRenderElement(element, componentProps, params = {}) {
  const renderProp = componentProps.render;
  const outProps = useRenderElementProps(componentProps, params);
  if (params.enabled === false) {
    return null;
  }
  const state = params.state ?? EMPTY_OBJECT;
  return evaluateRenderProp(element, renderProp, outProps, state);
}
function useRenderElementProps(componentProps, params = {}) {
  const {
    className: classNameProp,
    style: styleProp,
    render: renderProp
  } = componentProps;
  const {
    state = EMPTY_OBJECT,
    ref,
    props,
    stateAttributesMapping: stateAttributesMapping4,
    enabled = true
  } = params;
  const className = enabled ? resolveClassName(classNameProp, state) : void 0;
  const style = enabled ? resolveStyle(styleProp, state) : void 0;
  const stateProps = enabled ? getStateAttributesProps(state, stateAttributesMapping4) : EMPTY_OBJECT;
  const outProps = enabled ? mergeObjects(stateProps, Array.isArray(props) ? mergePropsN(props) : props) ?? EMPTY_OBJECT : EMPTY_OBJECT;
  if (typeof document !== "undefined") {
    if (!enabled) {
      useMergedRefs(null, null);
    } else if (Array.isArray(ref)) {
      outProps.ref = useMergedRefsN([outProps.ref, getReactElementRef(renderProp), ...ref]);
    } else {
      outProps.ref = useMergedRefs(outProps.ref, getReactElementRef(renderProp), ref);
    }
  }
  if (!enabled) {
    return EMPTY_OBJECT;
  }
  if (className !== void 0) {
    outProps.className = mergeClassNames(outProps.className, className);
  }
  if (style !== void 0) {
    outProps.style = mergeObjects(outProps.style, style);
  }
  return outProps;
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
function evaluateRenderProp(element, render, props, state) {
  if (render) {
    if (typeof render === "function") {
      if (true) {
        warnIfRenderPropLooksLikeComponent(render);
      }
      return render(props, state);
    }
    const mergedProps = mergeProps(props, render.props);
    mergedProps.ref = props.ref;
    let newElement = render;
    if ((newElement == null ? void 0 : newElement.$$typeof) === REACT_LAZY_TYPE) {
      const children = React11.Children.toArray(render);
      newElement = children[0];
    }
    if (true) {
      if (!React11.isValidElement(newElement)) {
        throw new Error(["Base UI: The `render` prop was provided an invalid React element as `React.isValidElement(render)` is `false`.", "A valid React element must be provided to the `render` prop because it is cloned with props to replace the default element.", "https://base-ui.com/r/invalid-render-prop"].join("\n"));
      }
    }
    return React11.cloneElement(newElement, mergedProps);
  }
  if (element) {
    if (typeof element === "string") {
      return renderTag(element, props);
    }
  }
  throw new Error(true ? "Base UI: Render element or function are not defined." : formatErrorMessage_default(8));
}
function warnIfRenderPropLooksLikeComponent(renderFn) {
  const functionName = renderFn.name;
  if (functionName.length === 0) {
    return;
  }
  const firstCharacterCode = functionName.charCodeAt(0);
  if (firstCharacterCode < 65 || firstCharacterCode > 90) {
    return;
  }
  warn(`The \`render\` prop received a function named \`${functionName}\` that starts with an uppercase letter.`, "This usually means a React component was passed directly as `render={Component}`.", "Base UI calls `render` as a plain function, which can break the Rules of Hooks during reconciliation.", "If this is an intentional render callback, rename it to start with a lowercase letter.", "Use `render={<Component />}` or `render={(props) => <Component {...props} />}` instead.", "https://base-ui.com/r/invalid-render-prop");
}
function renderTag(Tag, props) {
  if (Tag === "button") {
    return (0, import_react.createElement)("button", {
      type: "button",
      ...props,
      key: props.key
    });
  }
  if (Tag === "img") {
    return (0, import_react.createElement)("img", {
      alt: "",
      ...props,
      key: props.key
    });
  }
  return React11.createElement(Tag, props);
}

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingPortal.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var PortalContext = React12.createContext(null);
if (true) PortalContext.displayName = "PortalContext";
var usePortalContext = () => React12.useContext(PortalContext);
var attr = createAttribute("portal");
function useFloatingPortalNode(props = {}) {
  const {
    ref,
    container: containerProp,
    componentProps = EMPTY_OBJECT,
    elementProps
  } = props;
  const uniqueId = useId();
  const portalContext = usePortalContext();
  const parentPortalNode = portalContext == null ? void 0 : portalContext.portalNode;
  const [containerElement, setContainerElement] = React12.useState(null);
  const [portalNode, setPortalNode] = React12.useState(null);
  const setPortalNodeRef = useStableCallback((node) => {
    if (node !== null) {
      setPortalNode(node);
    }
  });
  const containerRef = React12.useRef(null);
  useIsoLayoutEffect(() => {
    if (containerProp === null) {
      if (containerRef.current) {
        containerRef.current = null;
        setPortalNode(null);
        setContainerElement(null);
      }
      return;
    }
    if (uniqueId == null) {
      return;
    }
    const resolvedContainer = (containerProp && (isNode(containerProp) ? containerProp : containerProp.current)) ?? parentPortalNode ?? document.body;
    if (resolvedContainer == null) {
      if (containerRef.current) {
        containerRef.current = null;
        setPortalNode(null);
        setContainerElement(null);
      }
      return;
    }
    if (containerRef.current !== resolvedContainer) {
      containerRef.current = resolvedContainer;
      setPortalNode(null);
      setContainerElement(resolvedContainer);
    }
  }, [containerProp, parentPortalNode, uniqueId]);
  const portalElement = useRenderElement("div", componentProps, {
    ref: [ref, setPortalNodeRef],
    props: [{
      id: uniqueId,
      [attr]: ""
    }, elementProps]
  });
  const portalSubtree = containerElement && portalElement ? ReactDOM.createPortal(portalElement, containerElement) : null;
  return {
    portalNode,
    portalSubtree
  };
}
var FloatingPortal = React12.forwardRef(function FloatingPortal2(componentProps, forwardedRef) {
  const {
    children,
    container,
    className,
    render,
    renderGuards,
    ...elementProps
  } = componentProps;
  const {
    portalNode,
    portalSubtree
  } = useFloatingPortalNode({
    container,
    ref: forwardedRef,
    componentProps,
    elementProps
  });
  const beforeOutsideRef = React12.useRef(null);
  const afterOutsideRef = React12.useRef(null);
  const beforeInsideRef = React12.useRef(null);
  const afterInsideRef = React12.useRef(null);
  const [focusManagerState, setFocusManagerState] = React12.useState(null);
  const modal = focusManagerState == null ? void 0 : focusManagerState.modal;
  const open = focusManagerState == null ? void 0 : focusManagerState.open;
  const shouldRenderGuards = typeof renderGuards === "boolean" ? renderGuards : !!focusManagerState && !focusManagerState.modal && focusManagerState.open && !!portalNode;
  React12.useEffect(() => {
    if (!portalNode || modal) {
      return void 0;
    }
    function onFocus(event) {
      if (portalNode && event.relatedTarget && isOutsideEvent(event)) {
        const focusing = event.type === "focusin";
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    portalNode.addEventListener("focusin", onFocus, true);
    portalNode.addEventListener("focusout", onFocus, true);
    return () => {
      portalNode.removeEventListener("focusin", onFocus, true);
      portalNode.removeEventListener("focusout", onFocus, true);
    };
  }, [portalNode, modal]);
  React12.useEffect(() => {
    if (!portalNode || open) {
      return;
    }
    enableFocusInside(portalNode);
  }, [open, portalNode]);
  const portalContextValue = React12.useMemo(() => ({
    beforeOutsideRef,
    afterOutsideRef,
    beforeInsideRef,
    afterInsideRef,
    portalNode,
    setFocusManagerState
  }), [portalNode]);
  return (0, import_jsx_runtime3.jsxs)(React12.Fragment, {
    children: [portalSubtree, (0, import_jsx_runtime3.jsxs)(PortalContext.Provider, {
      value: portalContextValue,
      children: [shouldRenderGuards && portalNode && (0, import_jsx_runtime3.jsx)(FocusGuard, {
        "data-type": "outside",
        ref: beforeOutsideRef,
        onFocus: (event) => {
          var _a;
          if (isOutsideEvent(event, portalNode)) {
            (_a = beforeInsideRef.current) == null ? void 0 : _a.focus();
          } else {
            const domReference = focusManagerState ? focusManagerState.domReference : null;
            const prevTabbable = getPreviousTabbable(domReference);
            prevTabbable == null ? void 0 : prevTabbable.focus();
          }
        }
      }), shouldRenderGuards && portalNode && (0, import_jsx_runtime3.jsx)("span", {
        "aria-owns": portalNode.id,
        style: ownerVisuallyHidden
      }), portalNode && ReactDOM.createPortal(children, portalNode), shouldRenderGuards && portalNode && (0, import_jsx_runtime3.jsx)(FocusGuard, {
        "data-type": "outside",
        ref: afterOutsideRef,
        onFocus: (event) => {
          var _a;
          if (isOutsideEvent(event, portalNode)) {
            (_a = afterInsideRef.current) == null ? void 0 : _a.focus();
          } else {
            const domReference = focusManagerState ? focusManagerState.domReference : null;
            const nextTabbable = getNextTabbable(domReference);
            nextTabbable == null ? void 0 : nextTabbable.focus();
            if (focusManagerState == null ? void 0 : focusManagerState.closeOnFocusOut) {
              focusManagerState == null ? void 0 : focusManagerState.onOpenChange(false, createChangeEventDetails(reason_parts_exports.focusOut, event.nativeEvent));
            }
          }
        }
      })]
    })]
  });
});
if (true) FloatingPortal.displayName = "FloatingPortal";

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingTree.js
var React13 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/utils/createEventEmitter.js
function createEventEmitter() {
  const map = /* @__PURE__ */ new Map();
  return {
    emit(event, data) {
      var _a;
      (_a = map.get(event)) == null ? void 0 : _a.forEach((listener) => listener(data));
    },
    on(event, listener) {
      if (!map.has(event)) {
        map.set(event, /* @__PURE__ */ new Set());
      }
      map.get(event).add(listener);
    },
    off(event, listener) {
      var _a;
      (_a = map.get(event)) == null ? void 0 : _a.delete(listener);
    }
  };
}

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingTree.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var FloatingNodeContext = React13.createContext(null);
if (true) FloatingNodeContext.displayName = "FloatingNodeContext";
var FloatingTreeContext = React13.createContext(null);
if (true) FloatingTreeContext.displayName = "FloatingTreeContext";
var useFloatingParentNodeId = () => {
  var _a;
  return ((_a = React13.useContext(FloatingNodeContext)) == null ? void 0 : _a.id) || null;
};
var useFloatingTree = (externalTree) => {
  const contextTree = React13.useContext(FloatingTreeContext);
  return externalTree ?? contextTree;
};

// node_modules/@base-ui/react/esm/utils/resolveRef.js
function resolveRef(maybeRef) {
  if (maybeRef == null) {
    return maybeRef;
  }
  return "current" in maybeRef ? maybeRef.current : maybeRef;
}

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingFocusManager.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
function getEventType(event, lastInteractionType) {
  const win = getWindow(event.target);
  if (event instanceof win.KeyboardEvent) {
    return "keyboard";
  }
  if (event instanceof win.FocusEvent) {
    return lastInteractionType || "keyboard";
  }
  if ("pointerType" in event) {
    return event.pointerType || "keyboard";
  }
  if ("touches" in event) {
    return "touch";
  }
  if (event instanceof win.MouseEvent) {
    return lastInteractionType || (event.detail === 0 ? "keyboard" : "mouse");
  }
  return "";
}
var LIST_LIMIT = 20;
var previouslyFocusedElements = [];
function clearDisconnectedPreviouslyFocusedElements() {
  previouslyFocusedElements = previouslyFocusedElements.filter((entry) => {
    var _a;
    return (_a = entry.deref()) == null ? void 0 : _a.isConnected;
  });
}
function addPreviouslyFocusedElement(element) {
  clearDisconnectedPreviouslyFocusedElements();
  if (element && getNodeName(element) !== "body") {
    previouslyFocusedElements.push(new WeakRef(element));
    if (previouslyFocusedElements.length > LIST_LIMIT) {
      previouslyFocusedElements = previouslyFocusedElements.slice(-LIST_LIMIT);
    }
  }
}
function getPreviouslyFocusedElement() {
  var _a;
  clearDisconnectedPreviouslyFocusedElements();
  return (_a = previouslyFocusedElements[previouslyFocusedElements.length - 1]) == null ? void 0 : _a.deref();
}
function getFirstTabbableElement(container) {
  if (!container) {
    return null;
  }
  const tabbableOptions = getTabbableOptions();
  if (isTabbable(container, tabbableOptions)) {
    return container;
  }
  return tabbable(container, tabbableOptions)[0] || container;
}
function isFocusable(element) {
  if (!element || !element.isConnected) {
    return false;
  }
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility();
  }
  return isElementVisible(element);
}
function handleTabIndex(floatingFocusElement, orderRef) {
  var _a;
  if (!orderRef.current.includes("floating") && !((_a = floatingFocusElement.getAttribute("role")) == null ? void 0 : _a.includes("dialog"))) {
    return;
  }
  const options = getTabbableOptions();
  const focusableElements = focusable(floatingFocusElement, options);
  const tabbableContent = focusableElements.filter((element) => {
    const dataTabIndex = element.getAttribute("data-tabindex") || "";
    return isTabbable(element, options) || element.hasAttribute("data-tabindex") && !dataTabIndex.startsWith("-");
  });
  const tabIndex = floatingFocusElement.getAttribute("tabindex");
  if (orderRef.current.includes("floating") || tabbableContent.length === 0) {
    if (tabIndex !== "0") {
      floatingFocusElement.setAttribute("tabindex", "0");
    }
  } else if (tabIndex !== "-1" || floatingFocusElement.hasAttribute("data-tabindex") && floatingFocusElement.getAttribute("data-tabindex") !== "-1") {
    floatingFocusElement.setAttribute("tabindex", "-1");
    floatingFocusElement.setAttribute("data-tabindex", "-1");
  }
}
function FloatingFocusManager(props) {
  const {
    context,
    children,
    disabled: disabled2 = false,
    initialFocus = true,
    returnFocus = true,
    restoreFocus = false,
    modal = true,
    closeOnFocusOut = true,
    openInteractionType = "",
    nextFocusableElement,
    previousFocusableElement,
    beforeContentFocusGuardRef,
    externalTree,
    getInsideElements
  } = props;
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const domReference = store.useState("domReferenceElement");
  const floating = store.useState("floatingElement");
  const {
    events,
    dataRef
  } = store.context;
  const getNodeId = useStableCallback(() => {
    var _a;
    return (_a = dataRef.current.floatingContext) == null ? void 0 : _a.nodeId;
  });
  const ignoreInitialFocus = initialFocus === false;
  const isUntrappedTypeableCombobox = isTypeableCombobox(domReference) && ignoreInitialFocus;
  const orderRef = React14.useRef(["content"]);
  const initialFocusRef = useValueAsRef(initialFocus);
  const returnFocusRef = useValueAsRef(returnFocus);
  const openInteractionTypeRef = useValueAsRef(openInteractionType);
  const tree = useFloatingTree(externalTree);
  const portalContext = usePortalContext();
  const preventReturnFocusRef = React14.useRef(false);
  const isPointerDownRef = React14.useRef(false);
  const pointerDownOutsideRef = React14.useRef(false);
  const tabbableIndexRef = React14.useRef(-1);
  const closeTypeRef = React14.useRef("");
  const lastInteractionTypeRef = React14.useRef("");
  const beforeGuardRef = React14.useRef(null);
  const afterGuardRef = React14.useRef(null);
  const mergedBeforeGuardRef = useMergedRefs(beforeGuardRef, beforeContentFocusGuardRef, portalContext == null ? void 0 : portalContext.beforeInsideRef);
  const mergedAfterGuardRef = useMergedRefs(afterGuardRef, portalContext == null ? void 0 : portalContext.afterInsideRef);
  const blurTimeout = useTimeout();
  const pointerDownTimeout = useTimeout();
  const restoreFocusFrame = useAnimationFrame();
  const isInsidePortal = portalContext != null;
  const floatingFocusElement = getFloatingFocusElement(floating);
  const getTabbableContent = useStableCallback((container = floatingFocusElement) => {
    return container ? tabbable(container, getTabbableOptions()) : [];
  });
  const getResolvedInsideElements = useStableCallback(() => (getInsideElements == null ? void 0 : getInsideElements().filter((element) => element != null)) ?? []);
  const getTabbableElements = useStableCallback((container) => {
    const content = getTabbableContent(container);
    return orderRef.current.map(() => content).filter(Boolean).flat();
  });
  React14.useEffect(() => {
    if (disabled2 || !modal) {
      return void 0;
    }
    function onKeyDown(event) {
      if (event.key === "Tab") {
        if (contains(floatingFocusElement, activeElement(ownerDocument(floatingFocusElement))) && getTabbableContent().length === 0 && !isUntrappedTypeableCombobox) {
          stopEvent(event);
        }
      }
    }
    const doc = ownerDocument(floatingFocusElement);
    doc.addEventListener("keydown", onKeyDown);
    return () => {
      doc.removeEventListener("keydown", onKeyDown);
    };
  }, [disabled2, domReference, floatingFocusElement, modal, orderRef, isUntrappedTypeableCombobox, getTabbableContent, getTabbableElements]);
  React14.useEffect(() => {
    if (disabled2 || !open) {
      return void 0;
    }
    const doc = ownerDocument(floatingFocusElement);
    function clearPointerDownOutside() {
      pointerDownOutsideRef.current = false;
    }
    function onPointerDown(event) {
      const target = getTarget(event);
      const insideElements = getResolvedInsideElements();
      const pointerTargetInside = contains(floating, target) || contains(domReference, target) || contains(portalContext == null ? void 0 : portalContext.portalNode, target) || insideElements.some((element) => element === target || contains(element, target));
      pointerDownOutsideRef.current = !pointerTargetInside;
      lastInteractionTypeRef.current = event.pointerType || "keyboard";
      if (target == null ? void 0 : target.closest(`[${CLICK_TRIGGER_IDENTIFIER}]`)) {
        isPointerDownRef.current = true;
      }
    }
    function onKeyDown() {
      lastInteractionTypeRef.current = "keyboard";
    }
    doc.addEventListener("pointerdown", onPointerDown, true);
    doc.addEventListener("pointerup", clearPointerDownOutside, true);
    doc.addEventListener("pointercancel", clearPointerDownOutside, true);
    doc.addEventListener("keydown", onKeyDown, true);
    return () => {
      doc.removeEventListener("pointerdown", onPointerDown, true);
      doc.removeEventListener("pointerup", clearPointerDownOutside, true);
      doc.removeEventListener("pointercancel", clearPointerDownOutside, true);
      doc.removeEventListener("keydown", onKeyDown, true);
    };
  }, [disabled2, floating, domReference, floatingFocusElement, open, portalContext, getResolvedInsideElements]);
  React14.useEffect(() => {
    if (disabled2 || !closeOnFocusOut) {
      return void 0;
    }
    const doc = ownerDocument(floatingFocusElement);
    function handlePointerDown() {
      isPointerDownRef.current = true;
      pointerDownTimeout.start(0, () => {
        isPointerDownRef.current = false;
      });
    }
    function handleFocusIn(event) {
      const target = getTarget(event);
      const tabbableContent = getTabbableContent();
      const tabbableIndex = tabbableContent.indexOf(target);
      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }
    }
    function handleFocusOutside(event) {
      const relatedTarget = event.relatedTarget;
      const currentTarget = event.currentTarget;
      const target = getTarget(event);
      queueMicrotask(() => {
        const nodeId = getNodeId();
        const triggers = store.context.triggerElements;
        const insideElements = getResolvedInsideElements();
        const isRelatedFocusGuard = (relatedTarget == null ? void 0 : relatedTarget.hasAttribute(createAttribute("focus-guard"))) && [beforeGuardRef.current, afterGuardRef.current, portalContext == null ? void 0 : portalContext.beforeInsideRef.current, portalContext == null ? void 0 : portalContext.afterInsideRef.current, portalContext == null ? void 0 : portalContext.beforeOutsideRef.current, portalContext == null ? void 0 : portalContext.afterOutsideRef.current, resolveRef(previousFocusableElement), resolveRef(nextFocusableElement)].includes(relatedTarget);
        const movedToUnrelatedNode = !(contains(domReference, relatedTarget) || contains(floating, relatedTarget) || contains(relatedTarget, floating) || contains(portalContext == null ? void 0 : portalContext.portalNode, relatedTarget) || insideElements.some((element) => element === relatedTarget || contains(element, relatedTarget)) || relatedTarget != null && triggers.hasElement(relatedTarget) || triggers.hasMatchingElement((trigger) => contains(trigger, relatedTarget)) || isRelatedFocusGuard || tree && (getNodeChildren(tree.nodesRef.current, nodeId).find((node) => {
          var _a, _b;
          return contains((_a = node.context) == null ? void 0 : _a.elements.floating, relatedTarget) || contains((_b = node.context) == null ? void 0 : _b.elements.domReference, relatedTarget);
        }) || getNodeAncestors(tree.nodesRef.current, nodeId).find((node) => {
          var _a, _b, _c;
          return [(_a = node.context) == null ? void 0 : _a.elements.floating, getFloatingFocusElement((_b = node.context) == null ? void 0 : _b.elements.floating)].includes(relatedTarget) || ((_c = node.context) == null ? void 0 : _c.elements.domReference) === relatedTarget;
        })));
        if (currentTarget === domReference && floatingFocusElement) {
          handleTabIndex(floatingFocusElement, orderRef);
        }
        if (restoreFocus && currentTarget !== domReference && !isFocusable(target) && activeElement(doc) === doc.body) {
          if (isHTMLElement(floatingFocusElement)) {
            floatingFocusElement.focus();
            if (restoreFocus === "popup") {
              restoreFocusFrame.request(() => {
                floatingFocusElement.focus();
              });
              return;
            }
          }
          const prevTabbableIndex = tabbableIndexRef.current;
          const tabbableContent = getTabbableContent();
          const nodeToFocus = tabbableContent[prevTabbableIndex] || tabbableContent[tabbableContent.length - 1] || floatingFocusElement;
          if (isHTMLElement(nodeToFocus)) {
            nodeToFocus.focus();
          }
        }
        if (dataRef.current.insideReactTree) {
          dataRef.current.insideReactTree = false;
          return;
        }
        if ((isUntrappedTypeableCombobox ? true : !modal) && relatedTarget && movedToUnrelatedNode && !isPointerDownRef.current && // Fix React 18 Strict Mode returnFocus due to double rendering.
        // For an "untrapped" typeable combobox (input role=combobox with
        // initialFocus=false), re-opening the popup and tabbing out should still close it even
        // when the previously focused element (e.g. the next tabbable outside the popup) is
        // focused again. Otherwise, the popup remains open on the second Tab sequence:
        // click input -> Tab (closes) -> click input -> Tab.
        // Allow closing when `isUntrappedTypeableCombobox` regardless of the previously focused element.
        (isUntrappedTypeableCombobox || relatedTarget !== getPreviouslyFocusedElement())) {
          preventReturnFocusRef.current = true;
          store.setOpen(false, createChangeEventDetails(reason_parts_exports.focusOut, event));
        }
      });
    }
    function markInsideReactTree() {
      if (pointerDownOutsideRef.current) {
        return;
      }
      dataRef.current.insideReactTree = true;
      blurTimeout.start(0, () => {
        dataRef.current.insideReactTree = false;
      });
    }
    const domReferenceElement = isHTMLElement(domReference) ? domReference : null;
    const cleanups = [];
    if (!floating && !domReferenceElement) {
      return void 0;
    }
    if (domReferenceElement) {
      domReferenceElement.addEventListener("focusout", handleFocusOutside);
      domReferenceElement.addEventListener("pointerdown", handlePointerDown);
      cleanups.push(() => {
        domReferenceElement.removeEventListener("focusout", handleFocusOutside);
        domReferenceElement.removeEventListener("pointerdown", handlePointerDown);
      });
    }
    if (floating) {
      floating.addEventListener("focusin", handleFocusIn);
      floating.addEventListener("focusout", handleFocusOutside);
      if (portalContext) {
        floating.addEventListener("focusout", markInsideReactTree, true);
        cleanups.push(() => {
          floating.removeEventListener("focusout", markInsideReactTree, true);
        });
      }
      cleanups.push(() => {
        floating.removeEventListener("focusin", handleFocusIn);
        floating.removeEventListener("focusout", handleFocusOutside);
      });
    }
    return () => {
      cleanups.forEach((cleanup) => {
        cleanup();
      });
    };
  }, [disabled2, domReference, floating, floatingFocusElement, modal, tree, portalContext, store, closeOnFocusOut, restoreFocus, getTabbableContent, isUntrappedTypeableCombobox, getNodeId, orderRef, dataRef, blurTimeout, pointerDownTimeout, restoreFocusFrame, nextFocusableElement, previousFocusableElement, getResolvedInsideElements]);
  React14.useEffect(() => {
    var _a, _b, _c;
    if (disabled2 || !floating || !open) {
      return void 0;
    }
    const portalNodes = Array.from(((_a = portalContext == null ? void 0 : portalContext.portalNode) == null ? void 0 : _a.querySelectorAll(`[${createAttribute("portal")}]`)) || []);
    const ancestors = tree ? getNodeAncestors(tree.nodesRef.current, getNodeId()) : [];
    const rootAncestorComboboxDomReference = (_c = (_b = ancestors.find((node) => {
      var _a2;
      return isTypeableCombobox(((_a2 = node.context) == null ? void 0 : _a2.elements.domReference) || null);
    })) == null ? void 0 : _b.context) == null ? void 0 : _c.elements.domReference;
    const controlInsideElements = [floating, ...portalNodes, beforeGuardRef.current, afterGuardRef.current, portalContext == null ? void 0 : portalContext.beforeOutsideRef.current, portalContext == null ? void 0 : portalContext.afterOutsideRef.current, ...getResolvedInsideElements()];
    const insideElements = [...controlInsideElements, rootAncestorComboboxDomReference, resolveRef(previousFocusableElement), resolveRef(nextFocusableElement), isUntrappedTypeableCombobox ? domReference : null].filter((x) => x != null);
    const ariaHiddenCleanup = markOthers(insideElements, {
      ariaHidden: modal || isUntrappedTypeableCombobox,
      mark: false
    });
    const markerInsideElements = [floating, ...portalNodes].filter((x) => x != null);
    const markerCleanup = markOthers(markerInsideElements);
    return () => {
      markerCleanup();
      ariaHiddenCleanup();
    };
  }, [open, disabled2, domReference, floating, modal, orderRef, portalContext, isUntrappedTypeableCombobox, tree, getNodeId, nextFocusableElement, previousFocusableElement, getResolvedInsideElements]);
  useIsoLayoutEffect(() => {
    if (!open || disabled2 || !isHTMLElement(floatingFocusElement)) {
      return;
    }
    const doc = ownerDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);
    queueMicrotask(() => {
      const focusableElements = getTabbableElements(floatingFocusElement);
      const initialFocusValueOrFn = initialFocusRef.current;
      const resolvedInitialFocus = typeof initialFocusValueOrFn === "function" ? initialFocusValueOrFn(openInteractionTypeRef.current || "") : initialFocusValueOrFn;
      if (resolvedInitialFocus === void 0 || resolvedInitialFocus === false) {
        return;
      }
      let elToFocus;
      if (resolvedInitialFocus === true || resolvedInitialFocus === null) {
        elToFocus = focusableElements[0] || floatingFocusElement;
      } else {
        elToFocus = resolveRef(resolvedInitialFocus);
      }
      elToFocus = elToFocus || focusableElements[0] || floatingFocusElement;
      const focusAlreadyInsideFloatingEl = contains(floatingFocusElement, previouslyFocusedElement);
      if (focusAlreadyInsideFloatingEl) {
        return;
      }
      enqueueFocus(elToFocus, {
        preventScroll: elToFocus === floatingFocusElement
      });
    });
  }, [disabled2, open, floatingFocusElement, ignoreInitialFocus, getTabbableElements, initialFocusRef, openInteractionTypeRef]);
  useIsoLayoutEffect(() => {
    if (disabled2 || !floatingFocusElement) {
      return void 0;
    }
    const doc = ownerDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);
    addPreviouslyFocusedElement(previouslyFocusedElement);
    function onOpenChangeLocal(details) {
      if (!details.open) {
        closeTypeRef.current = getEventType(details.nativeEvent, lastInteractionTypeRef.current);
      }
      if (details.reason === reason_parts_exports.triggerHover && details.nativeEvent.type === "mouseleave") {
        preventReturnFocusRef.current = true;
      }
      if (details.reason !== reason_parts_exports.outsidePress) {
        return;
      }
      if (details.nested) {
        preventReturnFocusRef.current = false;
      } else if (isVirtualClick(details.nativeEvent) || isVirtualPointerEvent(details.nativeEvent)) {
        preventReturnFocusRef.current = false;
      } else {
        let isPreventScrollSupported = false;
        document.createElement("div").focus({
          get preventScroll() {
            isPreventScrollSupported = true;
            return false;
          }
        });
        if (isPreventScrollSupported) {
          preventReturnFocusRef.current = false;
        } else {
          preventReturnFocusRef.current = true;
        }
      }
    }
    events.on("openchange", onOpenChangeLocal);
    function getReturnElement() {
      const returnFocusValueOrFn = returnFocusRef.current;
      let resolvedReturnFocusValue = typeof returnFocusValueOrFn === "function" ? returnFocusValueOrFn(closeTypeRef.current) : returnFocusValueOrFn;
      if (resolvedReturnFocusValue === void 0 || resolvedReturnFocusValue === false) {
        return null;
      }
      if (resolvedReturnFocusValue === null) {
        resolvedReturnFocusValue = true;
      }
      if (typeof resolvedReturnFocusValue === "boolean") {
        const el = domReference || getPreviouslyFocusedElement();
        return el && el.isConnected ? el : null;
      }
      const fallback = domReference || getPreviouslyFocusedElement();
      return resolveRef(resolvedReturnFocusValue) || fallback || null;
    }
    return () => {
      events.off("openchange", onOpenChangeLocal);
      const activeEl = activeElement(doc);
      const insideElements = getResolvedInsideElements();
      const isFocusInsideFloatingTree = contains(floating, activeEl) || insideElements.some((element) => element === activeEl || contains(element, activeEl)) || tree && getNodeChildren(tree.nodesRef.current, getNodeId(), false).some((node) => {
        var _a;
        return contains((_a = node.context) == null ? void 0 : _a.elements.floating, activeEl);
      });
      const returnElement = getReturnElement();
      queueMicrotask(() => {
        const tabbableReturnElement = getFirstTabbableElement(returnElement);
        const hasExplicitReturnFocus = typeof returnFocusRef.current !== "boolean";
        if (
          // eslint-disable-next-line react-hooks/exhaustive-deps
          returnFocusRef.current && !preventReturnFocusRef.current && isHTMLElement(tabbableReturnElement) && // If the focus moved somewhere else after mount, avoid returning focus
          // since it likely entered a different element which should be
          // respected: https://github.com/floating-ui/floating-ui/issues/2607
          (!hasExplicitReturnFocus && tabbableReturnElement !== activeEl && activeEl !== doc.body ? isFocusInsideFloatingTree : true)
        ) {
          tabbableReturnElement.focus({
            preventScroll: true
          });
        }
        preventReturnFocusRef.current = false;
      });
    };
  }, [disabled2, floating, floatingFocusElement, returnFocusRef, dataRef, events, tree, domReference, getNodeId, getResolvedInsideElements]);
  useIsoLayoutEffect(() => {
    if (!isWebKit2 || open || !floating) {
      return;
    }
    const activeEl = activeElement(ownerDocument(floating));
    if (!isHTMLElement(activeEl) || !isTypeableElement(activeEl)) {
      return;
    }
    if (contains(floating, activeEl)) {
      activeEl.blur();
    }
  }, [open, floating]);
  useIsoLayoutEffect(() => {
    if (disabled2 || !portalContext) {
      return void 0;
    }
    portalContext.setFocusManagerState({
      modal,
      closeOnFocusOut,
      open,
      onOpenChange: store.setOpen,
      domReference
    });
    return () => {
      portalContext.setFocusManagerState(null);
    };
  }, [disabled2, portalContext, modal, open, store, closeOnFocusOut, domReference]);
  useIsoLayoutEffect(() => {
    if (disabled2 || !floatingFocusElement) {
      return void 0;
    }
    handleTabIndex(floatingFocusElement, orderRef);
    return () => {
      queueMicrotask(clearDisconnectedPreviouslyFocusedElements);
    };
  }, [disabled2, floatingFocusElement, orderRef]);
  const shouldRenderGuards = !disabled2 && (modal ? !isUntrappedTypeableCombobox : true) && (isInsidePortal || modal);
  return (0, import_jsx_runtime5.jsxs)(React14.Fragment, {
    children: [shouldRenderGuards && (0, import_jsx_runtime5.jsx)(FocusGuard, {
      "data-type": "inside",
      ref: mergedBeforeGuardRef,
      onFocus: (event) => {
        var _a;
        if (modal) {
          const els = getTabbableElements();
          enqueueFocus(els[els.length - 1]);
        } else if (portalContext == null ? void 0 : portalContext.portalNode) {
          preventReturnFocusRef.current = false;
          if (isOutsideEvent(event, portalContext.portalNode)) {
            const nextTabbable = getNextTabbable(domReference);
            nextTabbable == null ? void 0 : nextTabbable.focus();
          } else {
            (_a = resolveRef(previousFocusableElement ?? portalContext.beforeOutsideRef)) == null ? void 0 : _a.focus();
          }
        }
      }
    }), children, shouldRenderGuards && (0, import_jsx_runtime5.jsx)(FocusGuard, {
      "data-type": "inside",
      ref: mergedAfterGuardRef,
      onFocus: (event) => {
        var _a;
        if (modal) {
          enqueueFocus(getTabbableElements()[0]);
        } else if (portalContext == null ? void 0 : portalContext.portalNode) {
          if (closeOnFocusOut) {
            preventReturnFocusRef.current = true;
          }
          if (isOutsideEvent(event, portalContext.portalNode)) {
            const prevTabbable = getPreviousTabbable(domReference);
            prevTabbable == null ? void 0 : prevTabbable.focus();
          } else {
            (_a = resolveRef(nextFocusableElement ?? portalContext.afterOutsideRef)) == null ? void 0 : _a.focus();
          }
        }
      }
    })]
  });
}

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useClick.js
var React15 = __toESM(require_react(), 1);
function useClick(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const dataRef = store.context.dataRef;
  const {
    enabled = true,
    event: eventOption = "click",
    toggle = true,
    ignoreMouse = false,
    stickIfOpen = true,
    touchOpenDelay = 0,
    reason = reason_parts_exports.triggerPress
  } = props;
  const pointerTypeRef = React15.useRef(void 0);
  const frame = useAnimationFrame();
  const touchOpenTimeout = useTimeout();
  const reference = React15.useMemo(() => ({
    onPointerDown(event) {
      pointerTypeRef.current = event.pointerType;
    },
    onMouseDown(event) {
      const pointerType = pointerTypeRef.current;
      const nativeEvent = event.nativeEvent;
      const open = store.select("open");
      if (event.button !== 0 || eventOption === "click" || isMouseLikePointerType(pointerType, true) && ignoreMouse) {
        return;
      }
      const openEvent = dataRef.current.openEvent;
      const openEventType = openEvent == null ? void 0 : openEvent.type;
      const hasClickedOnInactiveTrigger = store.select("domReferenceElement") !== event.currentTarget;
      const nextOpen = open && hasClickedOnInactiveTrigger || !(open && toggle && (openEvent && stickIfOpen ? openEventType === "click" || openEventType === "mousedown" : true));
      if (isTypeableElement(nativeEvent.target)) {
        const details = createChangeEventDetails(reason, nativeEvent, nativeEvent.target);
        if (nextOpen && pointerType === "touch" && touchOpenDelay > 0) {
          touchOpenTimeout.start(touchOpenDelay, () => {
            store.setOpen(true, details);
          });
        } else {
          store.setOpen(nextOpen, details);
        }
        return;
      }
      const eventCurrentTarget = event.currentTarget;
      frame.request(() => {
        const details = createChangeEventDetails(reason, nativeEvent, eventCurrentTarget);
        if (nextOpen && pointerType === "touch" && touchOpenDelay > 0) {
          touchOpenTimeout.start(touchOpenDelay, () => {
            store.setOpen(true, details);
          });
        } else {
          store.setOpen(nextOpen, details);
        }
      });
    },
    onClick(event) {
      if (eventOption === "mousedown-only") {
        return;
      }
      const pointerType = pointerTypeRef.current;
      if (eventOption === "mousedown" && pointerType) {
        pointerTypeRef.current = void 0;
        return;
      }
      if (isMouseLikePointerType(pointerType, true) && ignoreMouse) {
        return;
      }
      const open = store.select("open");
      const openEvent = dataRef.current.openEvent;
      const hasClickedOnInactiveTrigger = store.select("domReferenceElement") !== event.currentTarget;
      const nextOpen = open && hasClickedOnInactiveTrigger || !(open && toggle && (openEvent && stickIfOpen ? isClickLikeEvent(openEvent) : true));
      const details = createChangeEventDetails(reason, event.nativeEvent, event.currentTarget);
      if (nextOpen && pointerType === "touch" && touchOpenDelay > 0) {
        touchOpenTimeout.start(touchOpenDelay, () => {
          store.setOpen(true, details);
        });
      } else {
        store.setOpen(nextOpen, details);
      }
    },
    onKeyDown() {
      pointerTypeRef.current = void 0;
    }
  }), [dataRef, eventOption, ignoreMouse, store, stickIfOpen, toggle, frame, touchOpenTimeout, touchOpenDelay, reason]);
  return React15.useMemo(() => enabled ? {
    reference
  } : EMPTY_OBJECT, [enabled, reference]);
}

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useClientPoint.js
var React16 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useDismiss.js
var React17 = __toESM(require_react(), 1);
var bubbleHandlerKeys = {
  intentional: "onClick",
  sloppy: "onPointerDown"
};
function alwaysFalse() {
  return false;
}
function normalizeProp(normalizable) {
  return {
    escapeKey: typeof normalizable === "boolean" ? normalizable : (normalizable == null ? void 0 : normalizable.escapeKey) ?? false,
    outsidePress: typeof normalizable === "boolean" ? normalizable : (normalizable == null ? void 0 : normalizable.outsidePress) ?? true
  };
}
function useDismiss(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const floatingElement = store.useState("floatingElement");
  const {
    dataRef
  } = store.context;
  const {
    enabled = true,
    escapeKey: escapeKey2 = true,
    outsidePress: outsidePressProp = true,
    outsidePressEvent = "sloppy",
    referencePress = alwaysFalse,
    referencePressEvent = "sloppy",
    bubbles,
    externalTree
  } = props;
  const tree = useFloatingTree(externalTree);
  const outsidePressFn = useStableCallback(typeof outsidePressProp === "function" ? outsidePressProp : () => false);
  const outsidePress2 = typeof outsidePressProp === "function" ? outsidePressFn : outsidePressProp;
  const outsidePressEnabled = outsidePress2 !== false;
  const getOutsidePressEventProp = useStableCallback(() => outsidePressEvent);
  const pressStartedInsideRef = React17.useRef(false);
  const pressStartPreventedRef = React17.useRef(false);
  const suppressNextOutsideClickRef = React17.useRef(false);
  const {
    escapeKey: escapeKeyBubbles,
    outsidePress: outsidePressBubbles
  } = normalizeProp(bubbles);
  const touchStateRef = React17.useRef(null);
  const cancelDismissOnEndTimeout = useTimeout();
  const clearInsideReactTreeTimeout = useTimeout();
  const clearInsideReactTree = useStableCallback(() => {
    clearInsideReactTreeTimeout.clear();
    dataRef.current.insideReactTree = false;
  });
  const isComposingRef = React17.useRef(false);
  const currentPointerTypeRef = React17.useRef("");
  const isReferencePressEnabled = useStableCallback(referencePress);
  const closeOnEscapeKeyDown = useStableCallback((event) => {
    var _a;
    if (!open || !enabled || !escapeKey2 || event.key !== "Escape") {
      return;
    }
    if (isComposingRef.current) {
      return;
    }
    const nodeId = (_a = dataRef.current.floatingContext) == null ? void 0 : _a.nodeId;
    const children = tree ? getNodeChildren(tree.nodesRef.current, nodeId) : [];
    if (!escapeKeyBubbles) {
      if (children.length > 0) {
        let shouldDismiss = true;
        children.forEach((child) => {
          var _a2;
          if (((_a2 = child.context) == null ? void 0 : _a2.open) && !child.context.dataRef.current.__escapeKeyBubbles) {
            shouldDismiss = false;
          }
        });
        if (!shouldDismiss) {
          return;
        }
      }
    }
    const native = isReactEvent(event) ? event.nativeEvent : event;
    const eventDetails = createChangeEventDetails(reason_parts_exports.escapeKey, native);
    store.setOpen(false, eventDetails);
    if (!escapeKeyBubbles && !eventDetails.isPropagationAllowed) {
      event.stopPropagation();
    }
  });
  const markInsideReactTree = useStableCallback(() => {
    dataRef.current.insideReactTree = true;
    clearInsideReactTreeTimeout.start(0, clearInsideReactTree);
  });
  React17.useEffect(() => {
    if (!open || !enabled) {
      return void 0;
    }
    dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
    dataRef.current.__outsidePressBubbles = outsidePressBubbles;
    const compositionTimeout = new Timeout();
    const preventedPressSuppressionTimeout = new Timeout();
    function handleCompositionStart() {
      compositionTimeout.clear();
      isComposingRef.current = true;
    }
    function handleCompositionEnd() {
      compositionTimeout.start(
        // 0ms or 1ms don't work in Safari. 5ms appears to consistently work.
        // Only apply to WebKit for the test to remain 0ms.
        isWebKit() ? 5 : 0,
        () => {
          isComposingRef.current = false;
        }
      );
    }
    function suppressImmediateOutsideClickAfterPreventedStart() {
      suppressNextOutsideClickRef.current = true;
      preventedPressSuppressionTimeout.start(0, () => {
        suppressNextOutsideClickRef.current = false;
      });
    }
    function resetPressStartState() {
      pressStartedInsideRef.current = false;
      pressStartPreventedRef.current = false;
    }
    function getOutsidePressEvent() {
      const type = currentPointerTypeRef.current;
      const computedType = type === "pen" || !type ? "mouse" : type;
      const outsidePressEventValue = getOutsidePressEventProp();
      const resolved = typeof outsidePressEventValue === "function" ? outsidePressEventValue() : outsidePressEventValue;
      if (typeof resolved === "string") {
        return resolved;
      }
      return resolved[computedType];
    }
    function shouldIgnoreEvent(event) {
      const computedOutsidePressEvent = getOutsidePressEvent();
      return computedOutsidePressEvent === "intentional" && event.type !== "click" || computedOutsidePressEvent === "sloppy" && event.type === "click";
    }
    function isEventWithinFloatingTree(event) {
      var _a;
      const nodeId = (_a = dataRef.current.floatingContext) == null ? void 0 : _a.nodeId;
      const targetIsInsideChildren = tree && getNodeChildren(tree.nodesRef.current, nodeId).some((node) => {
        var _a2;
        return isEventTargetWithin(event, (_a2 = node.context) == null ? void 0 : _a2.elements.floating);
      });
      return isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement")) || targetIsInsideChildren;
    }
    function closeOnPressOutside(event) {
      var _a;
      if (shouldIgnoreEvent(event)) {
        clearInsideReactTree();
        return;
      }
      if (dataRef.current.insideReactTree) {
        clearInsideReactTree();
        return;
      }
      const target = getTarget(event);
      const inertSelector = `[${createAttribute("inert")}]`;
      let markers = Array.from(ownerDocument(store.select("floatingElement")).querySelectorAll(inertSelector));
      const targetRoot = isElement(target) ? target.getRootNode() : null;
      if (isShadowRoot(targetRoot)) {
        markers = markers.concat(Array.from(targetRoot.querySelectorAll(inertSelector)));
      }
      const triggers = store.context.triggerElements;
      if (target && (triggers.hasElement(target) || triggers.hasMatchingElement((trigger) => contains(trigger, target)))) {
        return;
      }
      let targetRootAncestor = isElement(target) ? target : null;
      while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
        const nextParent = getParentNode(targetRootAncestor);
        if (isLastTraversableNode(nextParent) || !isElement(nextParent)) {
          break;
        }
        targetRootAncestor = nextParent;
      }
      if (markers.length && isElement(target) && !isRootElement(target) && // Clicked on a direct ancestor (e.g. FloatingOverlay).
      !contains(target, store.select("floatingElement")) && // If the target root element contains none of the markers, then the
      // element was injected after the floating element rendered.
      markers.every((marker) => !contains(targetRootAncestor, marker))) {
        return;
      }
      if (isHTMLElement(target) && !("touches" in event)) {
        const lastTraversableNode = isLastTraversableNode(target);
        const style = getComputedStyle2(target);
        const scrollRe = /auto|scroll/;
        const isScrollableX = lastTraversableNode || scrollRe.test(style.overflowX);
        const isScrollableY = lastTraversableNode || scrollRe.test(style.overflowY);
        const canScrollX = isScrollableX && target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
        const canScrollY = isScrollableY && target.clientHeight > 0 && target.scrollHeight > target.clientHeight;
        const isRTL = style.direction === "rtl";
        const pressedVerticalScrollbar = canScrollY && (isRTL ? event.offsetX <= target.offsetWidth - target.clientWidth : event.offsetX > target.clientWidth);
        const pressedHorizontalScrollbar = canScrollX && event.offsetY > target.clientHeight;
        if (pressedVerticalScrollbar || pressedHorizontalScrollbar) {
          return;
        }
      }
      if (isEventWithinFloatingTree(event)) {
        return;
      }
      if (getOutsidePressEvent() === "intentional" && suppressNextOutsideClickRef.current) {
        preventedPressSuppressionTimeout.clear();
        suppressNextOutsideClickRef.current = false;
        return;
      }
      if (typeof outsidePress2 === "function" && !outsidePress2(event)) {
        return;
      }
      const nodeId = (_a = dataRef.current.floatingContext) == null ? void 0 : _a.nodeId;
      const children = tree ? getNodeChildren(tree.nodesRef.current, nodeId) : [];
      if (children.length > 0) {
        let shouldDismiss = true;
        children.forEach((child) => {
          var _a2;
          if (((_a2 = child.context) == null ? void 0 : _a2.open) && !child.context.dataRef.current.__outsidePressBubbles) {
            shouldDismiss = false;
          }
        });
        if (!shouldDismiss) {
          return;
        }
      }
      store.setOpen(false, createChangeEventDetails(reason_parts_exports.outsidePress, event));
      clearInsideReactTree();
    }
    function handlePointerDown(event) {
      if (getOutsidePressEvent() !== "sloppy" || event.pointerType === "touch" || !store.select("open") || !enabled || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
        return;
      }
      closeOnPressOutside(event);
    }
    function handleTouchStart(event) {
      if (getOutsidePressEvent() !== "sloppy" || !store.select("open") || !enabled || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
        return;
      }
      const touch = event.touches[0];
      if (touch) {
        touchStateRef.current = {
          startTime: Date.now(),
          startX: touch.clientX,
          startY: touch.clientY,
          dismissOnTouchEnd: false,
          dismissOnMouseDown: true
        };
        cancelDismissOnEndTimeout.start(1e3, () => {
          if (touchStateRef.current) {
            touchStateRef.current.dismissOnTouchEnd = false;
            touchStateRef.current.dismissOnMouseDown = false;
          }
        });
      }
    }
    function handleTouchStartCapture(event) {
      currentPointerTypeRef.current = "touch";
      const target = getTarget(event);
      function callback() {
        handleTouchStart(event);
        target == null ? void 0 : target.removeEventListener(event.type, callback);
      }
      target == null ? void 0 : target.addEventListener(event.type, callback);
    }
    function closeOnPressOutsideCapture(event) {
      cancelDismissOnEndTimeout.clear();
      if (event.type === "pointerdown") {
        currentPointerTypeRef.current = event.pointerType;
      }
      if (event.type === "mousedown" && touchStateRef.current && !touchStateRef.current.dismissOnMouseDown) {
        return;
      }
      const target = getTarget(event);
      function callback() {
        if (event.type === "pointerdown") {
          handlePointerDown(event);
        } else {
          closeOnPressOutside(event);
        }
        target == null ? void 0 : target.removeEventListener(event.type, callback);
      }
      target == null ? void 0 : target.addEventListener(event.type, callback);
    }
    function handlePressEndCapture(event) {
      if (!pressStartedInsideRef.current) {
        return;
      }
      const pressStartedInsideDefaultPrevented = pressStartPreventedRef.current;
      resetPressStartState();
      if (getOutsidePressEvent() !== "intentional") {
        return;
      }
      if (event.type === "pointercancel") {
        if (pressStartedInsideDefaultPrevented) {
          suppressImmediateOutsideClickAfterPreventedStart();
        }
        return;
      }
      if (isEventWithinFloatingTree(event)) {
        return;
      }
      if (pressStartedInsideDefaultPrevented) {
        suppressImmediateOutsideClickAfterPreventedStart();
        return;
      }
      if (typeof outsidePress2 === "function" && !outsidePress2(event)) {
        return;
      }
      preventedPressSuppressionTimeout.clear();
      suppressNextOutsideClickRef.current = true;
      clearInsideReactTree();
    }
    function handleTouchMove(event) {
      if (getOutsidePressEvent() !== "sloppy" || !touchStateRef.current || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
        return;
      }
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      const deltaX = Math.abs(touch.clientX - touchStateRef.current.startX);
      const deltaY = Math.abs(touch.clientY - touchStateRef.current.startY);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > 5) {
        touchStateRef.current.dismissOnTouchEnd = true;
      }
      if (distance > 10) {
        closeOnPressOutside(event);
        cancelDismissOnEndTimeout.clear();
        touchStateRef.current = null;
      }
    }
    function handleTouchMoveCapture(event) {
      const target = getTarget(event);
      function callback() {
        handleTouchMove(event);
        target == null ? void 0 : target.removeEventListener(event.type, callback);
      }
      target == null ? void 0 : target.addEventListener(event.type, callback);
    }
    function handleTouchEnd(event) {
      if (getOutsidePressEvent() !== "sloppy" || !touchStateRef.current || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
        return;
      }
      if (touchStateRef.current.dismissOnTouchEnd) {
        closeOnPressOutside(event);
      }
      cancelDismissOnEndTimeout.clear();
      touchStateRef.current = null;
    }
    function handleTouchEndCapture(event) {
      const target = getTarget(event);
      function callback() {
        handleTouchEnd(event);
        target == null ? void 0 : target.removeEventListener(event.type, callback);
      }
      target == null ? void 0 : target.addEventListener(event.type, callback);
    }
    const doc = ownerDocument(floatingElement);
    if (escapeKey2) {
      doc.addEventListener("keydown", closeOnEscapeKeyDown);
      doc.addEventListener("compositionstart", handleCompositionStart);
      doc.addEventListener("compositionend", handleCompositionEnd);
    }
    if (outsidePressEnabled) {
      doc.addEventListener("click", closeOnPressOutsideCapture, true);
      doc.addEventListener("pointerdown", closeOnPressOutsideCapture, true);
      doc.addEventListener("pointerup", handlePressEndCapture, true);
      doc.addEventListener("pointercancel", handlePressEndCapture, true);
      doc.addEventListener("mousedown", closeOnPressOutsideCapture, true);
      doc.addEventListener("mouseup", handlePressEndCapture, true);
      doc.addEventListener("touchstart", handleTouchStartCapture, true);
      doc.addEventListener("touchmove", handleTouchMoveCapture, true);
      doc.addEventListener("touchend", handleTouchEndCapture, true);
    }
    return () => {
      if (escapeKey2) {
        doc.removeEventListener("keydown", closeOnEscapeKeyDown);
        doc.removeEventListener("compositionstart", handleCompositionStart);
        doc.removeEventListener("compositionend", handleCompositionEnd);
      }
      if (outsidePressEnabled) {
        doc.removeEventListener("click", closeOnPressOutsideCapture, true);
        doc.removeEventListener("pointerdown", closeOnPressOutsideCapture, true);
        doc.removeEventListener("pointerup", handlePressEndCapture, true);
        doc.removeEventListener("pointercancel", handlePressEndCapture, true);
        doc.removeEventListener("mousedown", closeOnPressOutsideCapture, true);
        doc.removeEventListener("mouseup", handlePressEndCapture, true);
        doc.removeEventListener("touchstart", handleTouchStartCapture, true);
        doc.removeEventListener("touchmove", handleTouchMoveCapture, true);
        doc.removeEventListener("touchend", handleTouchEndCapture, true);
      }
      compositionTimeout.clear();
      preventedPressSuppressionTimeout.clear();
      resetPressStartState();
      suppressNextOutsideClickRef.current = false;
    };
  }, [dataRef, floatingElement, escapeKey2, outsidePressEnabled, outsidePress2, open, enabled, escapeKeyBubbles, outsidePressBubbles, closeOnEscapeKeyDown, clearInsideReactTree, getOutsidePressEventProp, tree, store, cancelDismissOnEndTimeout]);
  React17.useEffect(clearInsideReactTree, [outsidePress2, clearInsideReactTree]);
  const reference = React17.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    [bubbleHandlerKeys[referencePressEvent]]: (event) => {
      if (!isReferencePressEnabled()) {
        return;
      }
      store.setOpen(false, createChangeEventDetails(reason_parts_exports.triggerPress, event.nativeEvent));
    },
    ...referencePressEvent !== "intentional" && {
      onClick(event) {
        if (!isReferencePressEnabled()) {
          return;
        }
        store.setOpen(false, createChangeEventDetails(reason_parts_exports.triggerPress, event.nativeEvent));
      }
    }
  }), [closeOnEscapeKeyDown, store, referencePressEvent, isReferencePressEnabled]);
  const markPressStartedInsideReactTree = useStableCallback((event) => {
    if (!open || !enabled || event.button !== 0) {
      return;
    }
    const target = getTarget(event.nativeEvent);
    if (!contains(store.select("floatingElement"), target)) {
      return;
    }
    if (!pressStartedInsideRef.current) {
      pressStartedInsideRef.current = true;
      pressStartPreventedRef.current = false;
    }
  });
  const markInsidePressStartPrevented = useStableCallback((event) => {
    if (!open || !enabled) {
      return;
    }
    if (!(event.defaultPrevented || event.nativeEvent.defaultPrevented)) {
      return;
    }
    if (pressStartedInsideRef.current) {
      pressStartPreventedRef.current = true;
    }
  });
  const floating = React17.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    // `onMouseDown` may be blocked if `event.preventDefault()` is called in
    // `onPointerDown`, such as with <NumberField.ScrubArea>.
    // See https://github.com/mui/base-ui/pull/3379
    onPointerDown: markInsidePressStartPrevented,
    onMouseDown: markInsidePressStartPrevented,
    onClickCapture: markInsideReactTree,
    onMouseDownCapture(event) {
      markInsideReactTree();
      markPressStartedInsideReactTree(event);
    },
    onPointerDownCapture(event) {
      markInsideReactTree();
      markPressStartedInsideReactTree(event);
    },
    onMouseUpCapture: markInsideReactTree,
    onTouchEndCapture: markInsideReactTree,
    onTouchMoveCapture: markInsideReactTree
  }), [closeOnEscapeKeyDown, markInsideReactTree, markPressStartedInsideReactTree, markInsidePressStartPrevented]);
  return React17.useMemo(() => enabled ? {
    reference,
    floating,
    trigger: reference
  } : {}, [enabled, reference, floating]);
}

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useFloating.js
var React27 = __toESM(require_react(), 1);

// node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
var noOffsets = createCoords(0);

// node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
var React18 = __toESM(require_react(), 1);
var import_react2 = __toESM(require_react(), 1);
var ReactDOM2 = __toESM(require_react_dom(), 1);

// node_modules/reselect/dist/reselect.mjs
var runIdentityFunctionCheck = (resultFunc, inputSelectorsResults, outputSelectorResult) => {
  if (inputSelectorsResults.length === 1 && inputSelectorsResults[0] === outputSelectorResult) {
    let isInputSameAsOutput = false;
    try {
      const emptyObject = {};
      if (resultFunc(emptyObject) === emptyObject)
        isInputSameAsOutput = true;
    } catch {
    }
    if (isInputSameAsOutput) {
      let stack = void 0;
      try {
        throw new Error();
      } catch (e) {
        ;
        ({ stack } = e);
      }
      console.warn(
        "The result function returned its own inputs without modification. e.g\n`createSelector([state => state.todos], todos => todos)`\nThis could lead to inefficient memoization and unnecessary re-renders.\nEnsure transformation logic is in the result function, and extraction logic is in the input selectors.",
        { stack }
      );
    }
  }
};
var runInputStabilityCheck = (inputSelectorResultsObject, options, inputSelectorArgs) => {
  const { memoize, memoizeOptions } = options;
  const { inputSelectorResults, inputSelectorResultsCopy } = inputSelectorResultsObject;
  const createAnEmptyObject = memoize(() => ({}), ...memoizeOptions);
  const areInputSelectorResultsEqual = createAnEmptyObject.apply(null, inputSelectorResults) === createAnEmptyObject.apply(null, inputSelectorResultsCopy);
  if (!areInputSelectorResultsEqual) {
    let stack = void 0;
    try {
      throw new Error();
    } catch (e) {
      ;
      ({ stack } = e);
    }
    console.warn(
      "An input selector returned a different result when passed same arguments.\nThis means your output selector will likely run more frequently than intended.\nAvoid returning a new reference inside your input selector, e.g.\n`createSelector([state => state.todos.map(todo => todo.id)], todoIds => todoIds.length)`",
      {
        arguments: inputSelectorArgs,
        firstInputs: inputSelectorResults,
        secondInputs: inputSelectorResultsCopy,
        stack
      }
    );
  }
};
var globalDevModeChecks = {
  inputStabilityCheck: "once",
  identityFunctionCheck: "once"
};
var NOT_FOUND = Symbol("NOT_FOUND");
function assertIsFunction(func, errorMessage = `expected a function, instead received ${typeof func}`) {
  if (typeof func !== "function") {
    throw new TypeError(errorMessage);
  }
}
function assertIsObject(object, errorMessage = `expected an object, instead received ${typeof object}`) {
  if (typeof object !== "object") {
    throw new TypeError(errorMessage);
  }
}
function assertIsArrayOfFunctions(array, errorMessage = `expected all items to be functions, instead received the following types: `) {
  if (!array.every((item) => typeof item === "function")) {
    const itemTypes = array.map(
      (item) => typeof item === "function" ? `function ${item.name || "unnamed"}()` : typeof item
    ).join(", ");
    throw new TypeError(`${errorMessage}[${itemTypes}]`);
  }
}
var ensureIsArray = (item) => {
  return Array.isArray(item) ? item : [item];
};
function getDependencies(createSelectorArgs) {
  const dependencies = Array.isArray(createSelectorArgs[0]) ? createSelectorArgs[0] : createSelectorArgs;
  assertIsArrayOfFunctions(
    dependencies,
    `createSelector expects all input-selectors to be functions, but received the following types: `
  );
  return dependencies;
}
function collectInputSelectorResults(dependencies, inputSelectorArgs) {
  const inputSelectorResults = [];
  const { length } = dependencies;
  for (let i = 0; i < length; i++) {
    inputSelectorResults.push(dependencies[i].apply(null, inputSelectorArgs));
  }
  return inputSelectorResults;
}
var getDevModeChecksExecutionInfo = (firstRun, devModeChecks) => {
  const { identityFunctionCheck, inputStabilityCheck } = {
    ...globalDevModeChecks,
    ...devModeChecks
  };
  return {
    identityFunctionCheck: {
      shouldRun: identityFunctionCheck === "always" || identityFunctionCheck === "once" && firstRun,
      run: runIdentityFunctionCheck
    },
    inputStabilityCheck: {
      shouldRun: inputStabilityCheck === "always" || inputStabilityCheck === "once" && firstRun,
      run: runInputStabilityCheck
    }
  };
};
var REDUX_PROXY_LABEL = Symbol();
var proto = Object.getPrototypeOf({});
function createSingletonCache(equals) {
  let entry;
  return {
    get(key) {
      if (entry && equals(entry.key, key)) {
        return entry.value;
      }
      return NOT_FOUND;
    },
    put(key, value) {
      entry = { key, value };
    },
    getEntries() {
      return entry ? [entry] : [];
    },
    clear() {
      entry = void 0;
    }
  };
}
function createLruCache(maxSize, equals) {
  let entries = [];
  function get(key) {
    const cacheIndex = entries.findIndex((entry) => equals(key, entry.key));
    if (cacheIndex > -1) {
      const entry = entries[cacheIndex];
      if (cacheIndex > 0) {
        entries.splice(cacheIndex, 1);
        entries.unshift(entry);
      }
      return entry.value;
    }
    return NOT_FOUND;
  }
  function put(key, value) {
    if (get(key) === NOT_FOUND) {
      entries.unshift({ key, value });
      if (entries.length > maxSize) {
        entries.pop();
      }
    }
  }
  function getEntries() {
    return entries;
  }
  function clear() {
    entries = [];
  }
  return { get, put, getEntries, clear };
}
var referenceEqualityCheck = (a, b) => a === b;
function createCacheKeyComparator(equalityCheck) {
  return function areArgumentsShallowlyEqual(prev, next) {
    if (prev === null || next === null || prev.length !== next.length) {
      return false;
    }
    const { length } = prev;
    for (let i = 0; i < length; i++) {
      if (!equalityCheck(prev[i], next[i])) {
        return false;
      }
    }
    return true;
  };
}
function lruMemoize(func, equalityCheckOrOptions) {
  const providedOptions = typeof equalityCheckOrOptions === "object" ? equalityCheckOrOptions : { equalityCheck: equalityCheckOrOptions };
  const {
    equalityCheck = referenceEqualityCheck,
    maxSize = 1,
    resultEqualityCheck
  } = providedOptions;
  const comparator = createCacheKeyComparator(equalityCheck);
  let resultsCount = 0;
  const cache = maxSize <= 1 ? createSingletonCache(comparator) : createLruCache(maxSize, comparator);
  function memoized() {
    let value = cache.get(arguments);
    if (value === NOT_FOUND) {
      value = func.apply(null, arguments);
      resultsCount++;
      if (resultEqualityCheck) {
        const entries = cache.getEntries();
        const matchingEntry = entries.find(
          (entry) => resultEqualityCheck(entry.value, value)
        );
        if (matchingEntry) {
          value = matchingEntry.value;
          resultsCount !== 0 && resultsCount--;
        }
      }
      cache.put(arguments, value);
    }
    return value;
  }
  memoized.clearCache = () => {
    cache.clear();
    memoized.resetResultsCount();
  };
  memoized.resultsCount = () => resultsCount;
  memoized.resetResultsCount = () => {
    resultsCount = 0;
  };
  return memoized;
}
var StrongRef = class {
  constructor(value) {
    this.value = value;
  }
  deref() {
    return this.value;
  }
};
var Ref = typeof WeakRef !== "undefined" ? WeakRef : StrongRef;
var UNTERMINATED = 0;
var TERMINATED = 1;
function createCacheNode() {
  return {
    s: UNTERMINATED,
    v: void 0,
    o: null,
    p: null
  };
}
function weakMapMemoize(func, options = {}) {
  let fnNode = createCacheNode();
  const { resultEqualityCheck } = options;
  let lastResult;
  let resultsCount = 0;
  function memoized() {
    var _a;
    let cacheNode = fnNode;
    const { length } = arguments;
    for (let i = 0, l = length; i < l; i++) {
      const arg = arguments[i];
      if (typeof arg === "function" || typeof arg === "object" && arg !== null) {
        let objectCache = cacheNode.o;
        if (objectCache === null) {
          cacheNode.o = objectCache = /* @__PURE__ */ new WeakMap();
        }
        const objectNode = objectCache.get(arg);
        if (objectNode === void 0) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        let primitiveCache = cacheNode.p;
        if (primitiveCache === null) {
          cacheNode.p = primitiveCache = /* @__PURE__ */ new Map();
        }
        const primitiveNode = primitiveCache.get(arg);
        if (primitiveNode === void 0) {
          cacheNode = createCacheNode();
          primitiveCache.set(arg, cacheNode);
        } else {
          cacheNode = primitiveNode;
        }
      }
    }
    const terminatedNode = cacheNode;
    let result;
    if (cacheNode.s === TERMINATED) {
      result = cacheNode.v;
    } else {
      result = func.apply(null, arguments);
      resultsCount++;
      if (resultEqualityCheck) {
        const lastResultValue = ((_a = lastResult == null ? void 0 : lastResult.deref) == null ? void 0 : _a.call(lastResult)) ?? lastResult;
        if (lastResultValue != null && resultEqualityCheck(lastResultValue, result)) {
          result = lastResultValue;
          resultsCount !== 0 && resultsCount--;
        }
        const needsWeakRef = typeof result === "object" && result !== null || typeof result === "function";
        lastResult = needsWeakRef ? new Ref(result) : result;
      }
    }
    terminatedNode.s = TERMINATED;
    terminatedNode.v = result;
    return result;
  }
  memoized.clearCache = () => {
    fnNode = createCacheNode();
    memoized.resetResultsCount();
  };
  memoized.resultsCount = () => resultsCount;
  memoized.resetResultsCount = () => {
    resultsCount = 0;
  };
  return memoized;
}
function createSelectorCreator(memoizeOrOptions, ...memoizeOptionsFromArgs) {
  const createSelectorCreatorOptions = typeof memoizeOrOptions === "function" ? {
    memoize: memoizeOrOptions,
    memoizeOptions: memoizeOptionsFromArgs
  } : memoizeOrOptions;
  const createSelector22 = (...createSelectorArgs) => {
    let recomputations = 0;
    let dependencyRecomputations = 0;
    let lastResult;
    let directlyPassedOptions = {};
    let resultFunc = createSelectorArgs.pop();
    if (typeof resultFunc === "object") {
      directlyPassedOptions = resultFunc;
      resultFunc = createSelectorArgs.pop();
    }
    assertIsFunction(
      resultFunc,
      `createSelector expects an output function after the inputs, but received: [${typeof resultFunc}]`
    );
    const combinedOptions = {
      ...createSelectorCreatorOptions,
      ...directlyPassedOptions
    };
    const {
      memoize,
      memoizeOptions = [],
      argsMemoize = weakMapMemoize,
      argsMemoizeOptions = [],
      devModeChecks = {}
    } = combinedOptions;
    const finalMemoizeOptions = ensureIsArray(memoizeOptions);
    const finalArgsMemoizeOptions = ensureIsArray(argsMemoizeOptions);
    const dependencies = getDependencies(createSelectorArgs);
    const memoizedResultFunc = memoize(function recomputationWrapper() {
      recomputations++;
      return resultFunc.apply(
        null,
        arguments
      );
    }, ...finalMemoizeOptions);
    let firstRun = true;
    const selector = argsMemoize(function dependenciesChecker() {
      dependencyRecomputations++;
      const inputSelectorResults = collectInputSelectorResults(
        dependencies,
        arguments
      );
      lastResult = memoizedResultFunc.apply(null, inputSelectorResults);
      if (true) {
        const { identityFunctionCheck, inputStabilityCheck } = getDevModeChecksExecutionInfo(firstRun, devModeChecks);
        if (identityFunctionCheck.shouldRun) {
          identityFunctionCheck.run(
            resultFunc,
            inputSelectorResults,
            lastResult
          );
        }
        if (inputStabilityCheck.shouldRun) {
          const inputSelectorResultsCopy = collectInputSelectorResults(
            dependencies,
            arguments
          );
          inputStabilityCheck.run(
            { inputSelectorResults, inputSelectorResultsCopy },
            { memoize, memoizeOptions: finalMemoizeOptions },
            arguments
          );
        }
        if (firstRun)
          firstRun = false;
      }
      return lastResult;
    }, ...finalArgsMemoizeOptions);
    return Object.assign(selector, {
      resultFunc,
      memoizedResultFunc,
      dependencies,
      dependencyRecomputations: () => dependencyRecomputations,
      resetDependencyRecomputations: () => {
        dependencyRecomputations = 0;
      },
      lastResult: () => lastResult,
      recomputations: () => recomputations,
      resetRecomputations: () => {
        recomputations = 0;
      },
      memoize,
      argsMemoize
    });
  };
  Object.assign(createSelector22, {
    withTypes: () => createSelector22
  });
  return createSelector22;
}
var createSelector = createSelectorCreator(weakMapMemoize);
var createStructuredSelector = Object.assign(
  (inputSelectorsObject, selectorCreator = createSelector) => {
    assertIsObject(
      inputSelectorsObject,
      `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof inputSelectorsObject}`
    );
    const inputSelectorKeys = Object.keys(inputSelectorsObject);
    const dependencies = inputSelectorKeys.map(
      (key) => inputSelectorsObject[key]
    );
    const structuredSelector = selectorCreator(
      dependencies,
      (...inputSelectorResults) => {
        return inputSelectorResults.reduce((composition, value, index) => {
          composition[inputSelectorKeys[index]] = value;
          return composition;
        }, {});
      }
    );
    return structuredSelector;
  },
  { withTypes: () => createStructuredSelector }
);

// node_modules/@base-ui/utils/esm/store/createSelector.js
var reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is
  }
});
var createSelector2 = (a, b, c, d, e, f, ...other) => {
  if (other.length > 0) {
    throw new Error(true ? "Unsupported number of selectors" : formatErrorMessage_default(1));
  }
  let selector;
  if (a && b && c && d && e && f) {
    selector = (state, a1, a2, a3) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      const vd = d(state, a1, a2, a3);
      const ve = e(state, a1, a2, a3);
      return f(va, vb, vc, vd, ve, a1, a2, a3);
    };
  } else if (a && b && c && d && e) {
    selector = (state, a1, a2, a3) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      const vd = d(state, a1, a2, a3);
      return e(va, vb, vc, vd, a1, a2, a3);
    };
  } else if (a && b && c && d) {
    selector = (state, a1, a2, a3) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      return d(va, vb, vc, a1, a2, a3);
    };
  } else if (a && b && c) {
    selector = (state, a1, a2, a3) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      return c(va, vb, a1, a2, a3);
    };
  } else if (a && b) {
    selector = (state, a1, a2, a3) => {
      const va = a(state, a1, a2, a3);
      return b(va, a1, a2, a3);
    };
  } else if (a) {
    selector = a;
  } else {
    throw (
      /* minify-error-disabled */
      new Error("Missing arguments")
    );
  }
  return selector;
};

// node_modules/@base-ui/utils/esm/store/useStore.js
var React20 = __toESM(require_react(), 1);
var import_shim = __toESM(require_shim(), 1);
var import_with_selector = __toESM(require_with_selector(), 1);

// node_modules/@base-ui/utils/esm/fastHooks.js
var React19 = __toESM(require_react(), 1);
var hooks = [];
var currentInstance = void 0;
function getInstance() {
  return currentInstance;
}
function register(hook) {
  hooks.push(hook);
}

// node_modules/@base-ui/utils/esm/store/useStore.js
var canUseRawUseSyncExternalStore = isReactVersionAtLeast(19);
var useStoreImplementation = canUseRawUseSyncExternalStore ? useStoreFast : useStoreLegacy;
function useStore(store, selector, a1, a2, a3) {
  return useStoreImplementation(store, selector, a1, a2, a3);
}
function useStoreR19(store, selector, a1, a2, a3) {
  const getSelection = React20.useCallback(() => selector(store.getSnapshot(), a1, a2, a3), [store, selector, a1, a2, a3]);
  return (0, import_shim.useSyncExternalStore)(store.subscribe, getSelection, getSelection);
}
register({
  before(instance) {
    instance.syncIndex = 0;
    if (!instance.didInitialize) {
      instance.syncTick = 1;
      instance.syncHooks = [];
      instance.didChangeStore = true;
      instance.getSnapshot = () => {
        let didChange2 = false;
        for (let i = 0; i < instance.syncHooks.length; i += 1) {
          const hook = instance.syncHooks[i];
          const value = hook.selector(hook.store.state, hook.a1, hook.a2, hook.a3);
          if (hook.didChange || !Object.is(hook.value, value)) {
            didChange2 = true;
            hook.value = value;
            hook.didChange = false;
          }
        }
        if (didChange2) {
          instance.syncTick += 1;
        }
        return instance.syncTick;
      };
    }
  },
  after(instance) {
    if (instance.syncHooks.length > 0) {
      if (instance.didChangeStore) {
        instance.didChangeStore = false;
        instance.subscribe = (onStoreChange) => {
          const stores = /* @__PURE__ */ new Set();
          for (const hook of instance.syncHooks) {
            stores.add(hook.store);
          }
          const unsubscribes = [];
          for (const store of stores) {
            unsubscribes.push(store.subscribe(onStoreChange));
          }
          return () => {
            for (const unsubscribe of unsubscribes) {
              unsubscribe();
            }
          };
        };
      }
      (0, import_shim.useSyncExternalStore)(instance.subscribe, instance.getSnapshot, instance.getSnapshot);
    }
  }
});
function useStoreFast(store, selector, a1, a2, a3) {
  const instance = getInstance();
  if (!instance) {
    return useStoreR19(store, selector, a1, a2, a3);
  }
  const index = instance.syncIndex;
  instance.syncIndex += 1;
  let hook;
  if (!instance.didInitialize) {
    hook = {
      store,
      selector,
      a1,
      a2,
      a3,
      value: selector(store.getSnapshot(), a1, a2, a3),
      didChange: false
    };
    instance.syncHooks.push(hook);
  } else {
    hook = instance.syncHooks[index];
    if (hook.store !== store || hook.selector !== selector || !Object.is(hook.a1, a1) || !Object.is(hook.a2, a2) || !Object.is(hook.a3, a3)) {
      if (hook.store !== store) {
        instance.didChangeStore = true;
      }
      hook.store = store;
      hook.selector = selector;
      hook.a1 = a1;
      hook.a2 = a2;
      hook.a3 = a3;
      hook.didChange = true;
    }
  }
  return hook.value;
}
function useStoreLegacy(store, selector, a1, a2, a3) {
  return (0, import_with_selector.useSyncExternalStoreWithSelector)(store.subscribe, store.getSnapshot, store.getSnapshot, (state) => selector(state, a1, a2, a3));
}

// node_modules/@base-ui/utils/esm/store/Store.js
var Store = class {
  /**
   * The current state of the store.
   * This property is updated immediately when the state changes as a result of calling {@link setState}, {@link update}, or {@link set}.
   * To subscribe to state changes, use the {@link useState} method. The value returned by {@link useState} is updated after the component renders (similarly to React's useState).
   * The values can be used directly (to avoid subscribing to the store) in effects or event handlers.
   *
   * Do not modify properties in state directly. Instead, use the provided methods to ensure proper state management and listener notification.
   */
  // Internal state to handle recursive `setState()` calls
  constructor(state) {
    /**
     * Registers a listener that will be called whenever the store's state changes.
     *
     * @param fn The listener function to be called on state changes.
     * @returns A function to unsubscribe the listener.
     */
    __publicField(this, "subscribe", (fn) => {
      this.listeners.add(fn);
      return () => {
        this.listeners.delete(fn);
      };
    });
    /**
     * Returns the current state of the store.
     */
    __publicField(this, "getSnapshot", () => {
      return this.state;
    });
    this.state = state;
    this.listeners = /* @__PURE__ */ new Set();
    this.updateTick = 0;
  }
  /**
   * Updates the entire store's state and notifies all registered listeners.
   *
   * @param newState The new state to set for the store.
   */
  setState(newState) {
    if (this.state === newState) {
      return;
    }
    this.state = newState;
    this.updateTick += 1;
    const currentTick = this.updateTick;
    for (const listener of this.listeners) {
      if (currentTick !== this.updateTick) {
        return;
      }
      listener(newState);
    }
  }
  /**
   * Merges the provided changes into the current state and notifies listeners if there are changes.
   *
   * @param changes An object containing the changes to apply to the current state.
   */
  update(changes) {
    for (const key in changes) {
      if (!Object.is(this.state[key], changes[key])) {
        this.setState({
          ...this.state,
          ...changes
        });
        return;
      }
    }
  }
  /**
   * Sets a specific key in the store's state to a new value and notifies listeners if the value has changed.
   *
   * @param key The key in the store's state to update.
   * @param value The new value to set for the specified key.
   */
  set(key, value) {
    if (!Object.is(this.state[key], value)) {
      this.setState({
        ...this.state,
        [key]: value
      });
    }
  }
  /**
   * Gives the state a new reference and updates all registered listeners.
   */
  notifyAll() {
    const newState = {
      ...this.state
    };
    this.setState(newState);
  }
  use(selector, a1, a2, a3) {
    return useStore(this, selector, a1, a2, a3);
  }
};

// node_modules/@base-ui/utils/esm/store/ReactStore.js
var React21 = __toESM(require_react(), 1);
var ReactStore = class extends Store {
  /**
   * Creates a new ReactStore instance.
   *
   * @param state Initial state of the store.
   * @param context Non-reactive context values.
   * @param selectors Optional selectors for use with `useState`.
   */
  constructor(state, context = {}, selectors3) {
    super(state);
    this.context = context;
    this.selectors = selectors3;
  }
  /**
   * Non-reactive values such as refs, callbacks, etc.
   */
  /**
   * Synchronizes a single external value into the store.
   *
   * Note that the while the value in `state` is updated immediately, the value returned
   * by `useState` is updated before the next render (similarly to React's `useState`).
   */
  useSyncedValue(key, value) {
    React21.useDebugValue(key);
    useIsoLayoutEffect(() => {
      if (this.state[key] !== value) {
        this.set(key, value);
      }
    }, [key, value]);
  }
  /**
   * Synchronizes a single external value into the store and
   * cleans it up (sets to `undefined`) on unmount.
   *
   * Note that the while the value in `state` is updated immediately, the value returned
   * by `useState` is updated before the next render (similarly to React's `useState`).
   */
  useSyncedValueWithCleanup(key, value) {
    const store = this;
    useIsoLayoutEffect(() => {
      if (store.state[key] !== value) {
        store.set(key, value);
      }
      return () => {
        store.set(key, void 0);
      };
    }, [store, key, value]);
  }
  /**
   * Synchronizes multiple external values into the store.
   *
   * Note that the while the values in `state` are updated immediately, the values returned
   * by `useState` are updated before the next render (similarly to React's `useState`).
   */
  useSyncedValues(statePart) {
    const store = this;
    if (true) {
      React21.useDebugValue(statePart, (p) => Object.keys(p));
      const keys = React21.useRef(Object.keys(statePart)).current;
      const nextKeys = Object.keys(statePart);
      if (keys.length !== nextKeys.length || keys.some((key, index) => key !== nextKeys[index])) {
        console.error("ReactStore.useSyncedValues expects the same prop keys on every render. Keys should be stable.");
      }
    }
    const dependencies = Object.values(statePart);
    useIsoLayoutEffect(() => {
      store.update(statePart);
    }, [store, ...dependencies]);
  }
  /**
   * Registers a controllable prop pair (`controlled`, `defaultValue`) for a specific key. If `controlled`
   * is non-undefined, the store's state at `key` is updated to match `controlled`.
   */
  useControlledProp(key, controlled) {
    React21.useDebugValue(key);
    const isControlled = controlled !== void 0;
    useIsoLayoutEffect(() => {
      if (isControlled && !Object.is(this.state[key], controlled)) {
        super.setState({
          ...this.state,
          [key]: controlled
        });
      }
    }, [key, controlled, isControlled]);
    if (true) {
      const cache = this.controlledValues ?? (this.controlledValues = /* @__PURE__ */ new Map());
      if (!cache.has(key)) {
        cache.set(key, isControlled);
      }
      const previouslyControlled = cache.get(key);
      if (previouslyControlled !== void 0 && previouslyControlled !== isControlled) {
        console.error(`A component is changing the ${isControlled ? "" : "un"}controlled state of ${key.toString()} to be ${isControlled ? "un" : ""}controlled. Elements should not switch from uncontrolled to controlled (or vice versa).`);
      }
    }
  }
  /** Gets the current value from the store using a selector with the provided key.
   *
   * @param key Key of the selector to use.
   */
  select(key, a1, a2, a3) {
    const selector = this.selectors[key];
    return selector(this.state, a1, a2, a3);
  }
  /**
   * Returns a value from the store's state using a selector function.
   * Used to subscribe to specific parts of the state.
   * This methods causes a rerender whenever the selected state changes.
   *
   * @param key Key of the selector to use.
   */
  useState(key, a1, a2, a3) {
    React21.useDebugValue(key);
    return useStore(this, this.selectors[key], a1, a2, a3);
  }
  /**
   * Wraps a function with `useStableCallback` to ensure it has a stable reference
   * and assigns it to the context.
   *
   * @param key Key of the event callback. Must be a function in the context.
   * @param fn Function to assign.
   */
  useContextCallback(key, fn) {
    React21.useDebugValue(key);
    const stableFunction = useStableCallback(fn ?? NOOP);
    this.context[key] = stableFunction;
  }
  /**
   * Returns a stable setter function for a specific key in the store's state.
   * It's commonly used to pass as a ref callback to React elements.
   *
   * @param key Key of the state to set.
   */
  useStateSetter(key) {
    const ref = React21.useRef(void 0);
    if (ref.current === void 0) {
      ref.current = (value) => {
        this.set(key, value);
      };
    }
    return ref.current;
  }
  /**
   * Observes changes derived from the store's selectors and calls the listener when the selected value changes.
   *
   * @param key Key of the selector to observe.
   * @param listener Listener function called when the selector result changes.
   */
  observe(selector, listener) {
    let selectFn;
    if (typeof selector === "function") {
      selectFn = selector;
    } else {
      selectFn = this.selectors[selector];
    }
    let prevValue = selectFn(this.state);
    listener(prevValue, prevValue, this);
    return this.subscribe((nextState) => {
      const nextValue = selectFn(nextState);
      if (!Object.is(prevValue, nextValue)) {
        const oldValue = prevValue;
        prevValue = nextValue;
        listener(nextValue, oldValue, this);
      }
    });
  }
};

// node_modules/@base-ui/utils/esm/store/StoreInspector.js
var React23 = __toESM(require_react(), 1);
var ReactDOM3 = __toESM(require_react_dom(), 1);

// node_modules/@base-ui/utils/esm/useForcedRerendering.js
var React22 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/store/StoreInspector.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingRootStore.js
var selectors = {
  open: createSelector2((state) => state.open),
  domReferenceElement: createSelector2((state) => state.domReferenceElement),
  referenceElement: createSelector2((state) => state.positionReference ?? state.referenceElement),
  floatingElement: createSelector2((state) => state.floatingElement),
  floatingId: createSelector2((state) => state.floatingId)
};
var FloatingRootStore = class extends ReactStore {
  constructor(options) {
    const {
      nested,
      noEmit,
      onOpenChange,
      triggerElements,
      ...initialState
    } = options;
    super({
      ...initialState,
      positionReference: initialState.referenceElement,
      domReferenceElement: initialState.referenceElement
    }, {
      onOpenChange,
      dataRef: {
        current: {}
      },
      events: createEventEmitter(),
      nested,
      noEmit,
      triggerElements
    }, selectors);
    /**
     * Emits the `openchange` event through the internal event emitter and calls the `onOpenChange` handler with the provided arguments.
     *
     * @param newOpen The new open state.
     * @param eventDetails Details about the event that triggered the open state change.
     */
    __publicField(this, "setOpen", (newOpen, eventDetails) => {
      var _a, _b;
      if (!newOpen || !this.state.open || // Prevent a pending hover-open from overwriting a click-open event, while allowing
      // click events to upgrade a hover-open.
      isClickLikeEvent(eventDetails.event)) {
        this.context.dataRef.current.openEvent = newOpen ? eventDetails.event : void 0;
      }
      if (!this.context.noEmit) {
        const details = {
          open: newOpen,
          reason: eventDetails.reason,
          nativeEvent: eventDetails.event,
          nested: this.context.nested,
          triggerElement: eventDetails.trigger
        };
        this.context.events.emit("openchange", details);
      }
      (_b = (_a = this.context).onOpenChange) == null ? void 0 : _b.call(_a, newOpen, eventDetails);
    });
  }
};

// node_modules/@base-ui/react/esm/utils/popups/popupStoreUtils.js
var React26 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/utils/useTransitionStatus.js
var React24 = __toESM(require_react(), 1);
function useTransitionStatus(open, enableIdleState = false, deferEndingState = false) {
  const [transitionStatus, setTransitionStatus] = React24.useState(open && enableIdleState ? "idle" : void 0);
  const [mounted, setMounted] = React24.useState(open);
  if (open && !mounted) {
    setMounted(true);
    setTransitionStatus("starting");
  }
  if (!open && mounted && transitionStatus !== "ending" && !deferEndingState) {
    setTransitionStatus("ending");
  }
  if (!open && !mounted && transitionStatus === "ending") {
    setTransitionStatus(void 0);
  }
  useIsoLayoutEffect(() => {
    if (!open && mounted && transitionStatus !== "ending" && deferEndingState) {
      const frame = AnimationFrame.request(() => {
        setTransitionStatus("ending");
      });
      return () => {
        AnimationFrame.cancel(frame);
      };
    }
    return void 0;
  }, [open, mounted, transitionStatus, deferEndingState]);
  useIsoLayoutEffect(() => {
    if (!open || enableIdleState) {
      return void 0;
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus(void 0);
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open]);
  useIsoLayoutEffect(() => {
    if (!open || !enableIdleState) {
      return void 0;
    }
    if (open && mounted && transitionStatus !== "idle") {
      setTransitionStatus("starting");
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus("idle");
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open, mounted, setTransitionStatus, transitionStatus]);
  return React24.useMemo(() => ({
    mounted,
    setMounted,
    transitionStatus
  }), [mounted, transitionStatus]);
}

// node_modules/@base-ui/react/esm/utils/useOpenChangeComplete.js
var React25 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/utils/useAnimationsFinished.js
var ReactDOM4 = __toESM(require_react_dom(), 1);

// node_modules/@base-ui/react/esm/utils/stateAttributesMapping.js
var TransitionStatusDataAttributes = (function(TransitionStatusDataAttributes2) {
  TransitionStatusDataAttributes2["startingStyle"] = "data-starting-style";
  TransitionStatusDataAttributes2["endingStyle"] = "data-ending-style";
  return TransitionStatusDataAttributes2;
})({});
var STARTING_HOOK = {
  [TransitionStatusDataAttributes.startingStyle]: ""
};
var ENDING_HOOK = {
  [TransitionStatusDataAttributes.endingStyle]: ""
};
var transitionStatusMapping = {
  transitionStatus(value) {
    if (value === "starting") {
      return STARTING_HOOK;
    }
    if (value === "ending") {
      return ENDING_HOOK;
    }
    return null;
  }
};

// node_modules/@base-ui/react/esm/utils/useAnimationsFinished.js
function useAnimationsFinished(elementOrRef, waitForStartingStyleRemoved = false, treatAbortedAsFinished = true) {
  const frame = useAnimationFrame();
  return useStableCallback((fnToExecute, signal = null) => {
    frame.cancel();
    function done() {
      ReactDOM4.flushSync(fnToExecute);
    }
    const element = resolveRef(elementOrRef);
    if (element == null) {
      return;
    }
    const resolvedElement = element;
    if (typeof resolvedElement.getAnimations !== "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
      fnToExecute();
    } else {
      let execWaitForStartingStyleRemoved = function() {
        const startingStyleAttribute = TransitionStatusDataAttributes.startingStyle;
        if (!resolvedElement.hasAttribute(startingStyleAttribute)) {
          frame.request(exec);
          return;
        }
        const attributeObserver = new MutationObserver(() => {
          if (!resolvedElement.hasAttribute(startingStyleAttribute)) {
            attributeObserver.disconnect();
            exec();
          }
        });
        attributeObserver.observe(resolvedElement, {
          attributes: true,
          attributeFilter: [startingStyleAttribute]
        });
        signal == null ? void 0 : signal.addEventListener("abort", () => attributeObserver.disconnect(), {
          once: true
        });
      }, exec = function() {
        Promise.all(resolvedElement.getAnimations().map((anim) => anim.finished)).then(() => {
          if (signal == null ? void 0 : signal.aborted) {
            return;
          }
          done();
        }).catch(() => {
          const currentAnimations = resolvedElement.getAnimations();
          if (treatAbortedAsFinished) {
            if (signal == null ? void 0 : signal.aborted) {
              return;
            }
            done();
          } else if (currentAnimations.length > 0 && currentAnimations.some((anim) => anim.pending || anim.playState !== "finished")) {
            exec();
          }
        });
      };
      if (waitForStartingStyleRemoved) {
        execWaitForStartingStyleRemoved();
        return;
      }
      frame.request(exec);
    }
  });
}

// node_modules/@base-ui/react/esm/utils/useOpenChangeComplete.js
function useOpenChangeComplete(parameters) {
  const {
    enabled = true,
    open,
    ref,
    onComplete: onCompleteParam
  } = parameters;
  const onComplete = useStableCallback(onCompleteParam);
  const runOnceAnimationsFinish = useAnimationsFinished(ref, open, false);
  React25.useEffect(() => {
    if (!enabled) {
      return void 0;
    }
    const abortController = new AbortController();
    runOnceAnimationsFinish(onComplete, abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [enabled, open, onComplete, runOnceAnimationsFinish]);
}

// node_modules/@base-ui/react/esm/utils/popups/popupStoreUtils.js
function useTriggerRegistration(id, store) {
  const registeredElementIdRef = React26.useRef(null);
  const registeredElementRef = React26.useRef(null);
  return React26.useCallback((element) => {
    if (id === void 0) {
      return;
    }
    if (registeredElementIdRef.current !== null) {
      const registeredId = registeredElementIdRef.current;
      const registeredElement = registeredElementRef.current;
      const currentElement = store.context.triggerElements.getById(registeredId);
      if (registeredElement && currentElement === registeredElement) {
        store.context.triggerElements.delete(registeredId);
      }
      registeredElementIdRef.current = null;
      registeredElementRef.current = null;
    }
    if (element !== null) {
      registeredElementIdRef.current = id;
      registeredElementRef.current = element;
      store.context.triggerElements.add(id, element);
    }
  }, [store, id]);
}
function useTriggerDataForwarding(triggerId, triggerElementRef, store, stateUpdates) {
  const isMountedByThisTrigger = store.useState("isMountedByTrigger", triggerId);
  const baseRegisterTrigger = useTriggerRegistration(triggerId, store);
  const registerTrigger = useStableCallback((element) => {
    baseRegisterTrigger(element);
    if (!element || !store.select("open")) {
      return;
    }
    const activeTriggerId = store.select("activeTriggerId");
    if (activeTriggerId === triggerId) {
      store.update({
        activeTriggerElement: element,
        ...stateUpdates
      });
      return;
    }
    if (activeTriggerId == null) {
      store.update({
        activeTriggerId: triggerId,
        activeTriggerElement: element,
        ...stateUpdates
      });
    }
  });
  useIsoLayoutEffect(() => {
    if (isMountedByThisTrigger) {
      store.update({
        activeTriggerElement: triggerElementRef.current,
        ...stateUpdates
      });
    }
  }, [isMountedByThisTrigger, store, triggerElementRef, ...Object.values(stateUpdates)]);
  return {
    registerTrigger,
    isMountedByThisTrigger
  };
}
function useImplicitActiveTrigger(store) {
  const open = store.useState("open");
  useIsoLayoutEffect(() => {
    if (open && !store.select("activeTriggerId") && store.context.triggerElements.size === 1) {
      const iteratorResult = store.context.triggerElements.entries().next();
      if (!iteratorResult.done) {
        const [implicitTriggerId, implicitTriggerElement] = iteratorResult.value;
        store.update({
          activeTriggerId: implicitTriggerId,
          activeTriggerElement: implicitTriggerElement
        });
      }
    }
  }, [open, store]);
}
function useOpenStateTransitions(open, store, onUnmount) {
  const {
    mounted,
    setMounted,
    transitionStatus
  } = useTransitionStatus(open);
  store.useSyncedValues({
    mounted,
    transitionStatus
  });
  const forceUnmount = useStableCallback(() => {
    var _a, _b;
    setMounted(false);
    store.update({
      activeTriggerId: null,
      activeTriggerElement: null,
      mounted: false
    });
    onUnmount == null ? void 0 : onUnmount();
    (_b = (_a = store.context).onOpenChangeComplete) == null ? void 0 : _b.call(_a, false);
  });
  const preventUnmountingOnClose = store.useState("preventUnmountingOnClose");
  useOpenChangeComplete({
    enabled: !preventUnmountingOnClose,
    open,
    ref: store.context.popupRef,
    onComplete() {
      if (!open) {
        forceUnmount();
      }
    }
  });
  return {
    forceUnmount,
    transitionStatus
  };
}

// node_modules/@base-ui/react/esm/utils/popups/popupTriggerMap.js
var PopupTriggerMap = class {
  constructor() {
    this.elementsSet = /* @__PURE__ */ new Set();
    this.idMap = /* @__PURE__ */ new Map();
  }
  /**
   * Adds a trigger element with the given ID.
   *
   * Note: The provided element is assumed to not be registered under multiple IDs.
   */
  add(id, element) {
    const existingElement = this.idMap.get(id);
    if (existingElement === element) {
      return;
    }
    if (existingElement !== void 0) {
      this.elementsSet.delete(existingElement);
    }
    this.elementsSet.add(element);
    this.idMap.set(id, element);
    if (true) {
      if (this.elementsSet.size !== this.idMap.size) {
        throw new Error("Base UI: A trigger element cannot be registered under multiple IDs in PopupTriggerMap.");
      }
    }
  }
  /**
   * Removes the trigger element with the given ID.
   */
  delete(id) {
    const element = this.idMap.get(id);
    if (element) {
      this.elementsSet.delete(element);
      this.idMap.delete(id);
    }
  }
  /**
   * Whether the given element is registered as a trigger.
   */
  hasElement(element) {
    return this.elementsSet.has(element);
  }
  /**
   * Whether there is a registered trigger element matching the given predicate.
   */
  hasMatchingElement(predicate) {
    for (const element of this.elementsSet) {
      if (predicate(element)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns the trigger element associated with the given ID, or undefined if no such element exists.
   */
  getById(id) {
    return this.idMap.get(id);
  }
  /**
   * Returns an iterable of all registered trigger entries, where each entry is a tuple of [id, element].
   */
  entries() {
    return this.idMap.entries();
  }
  /**
   * Returns an iterable of all registered trigger elements.
   */
  elements() {
    return this.elementsSet.values();
  }
  /**
   * Returns the number of registered trigger elements.
   */
  get size() {
    return this.idMap.size;
  }
};

// node_modules/@base-ui/react/esm/floating-ui-react/utils/getEmptyRootContext.js
function getEmptyRootContext() {
  return new FloatingRootStore({
    open: false,
    floatingElement: null,
    referenceElement: null,
    triggerElements: new PopupTriggerMap(),
    floatingId: "",
    nested: false,
    noEmit: false,
    onOpenChange: void 0
  });
}

// node_modules/@base-ui/react/esm/utils/popups/store.js
function createInitialPopupStoreState() {
  return {
    open: false,
    openProp: void 0,
    mounted: false,
    transitionStatus: "idle",
    floatingRootContext: getEmptyRootContext(),
    preventUnmountingOnClose: false,
    payload: void 0,
    activeTriggerId: null,
    activeTriggerElement: null,
    triggerIdProp: void 0,
    popupElement: null,
    positionerElement: null,
    activeTriggerProps: EMPTY_OBJECT,
    inactiveTriggerProps: EMPTY_OBJECT,
    popupProps: EMPTY_OBJECT
  };
}
var activeTriggerIdSelector = createSelector2((state) => state.triggerIdProp ?? state.activeTriggerId);
var popupStoreSelectors = {
  open: createSelector2((state) => state.openProp ?? state.open),
  mounted: createSelector2((state) => state.mounted),
  transitionStatus: createSelector2((state) => state.transitionStatus),
  floatingRootContext: createSelector2((state) => state.floatingRootContext),
  preventUnmountingOnClose: createSelector2((state) => state.preventUnmountingOnClose),
  payload: createSelector2((state) => state.payload),
  activeTriggerId: activeTriggerIdSelector,
  activeTriggerElement: createSelector2((state) => state.mounted ? state.activeTriggerElement : null),
  /**
   * Whether the trigger with the given ID was used to open the popup.
   */
  isTriggerActive: createSelector2((state, triggerId) => triggerId !== void 0 && activeTriggerIdSelector(state) === triggerId),
  /**
   * Whether the popup is open and was activated by a trigger with the given ID.
   */
  isOpenedByTrigger: createSelector2((state, triggerId) => triggerId !== void 0 && activeTriggerIdSelector(state) === triggerId && state.open),
  /**
   * Whether the popup is mounted and was activated by a trigger with the given ID.
   */
  isMountedByTrigger: createSelector2((state, triggerId) => triggerId !== void 0 && activeTriggerIdSelector(state) === triggerId && state.mounted),
  triggerProps: createSelector2((state, isActive) => isActive ? state.activeTriggerProps : state.inactiveTriggerProps),
  popupProps: createSelector2((state) => state.popupProps),
  popupElement: createSelector2((state) => state.popupElement),
  positionerElement: createSelector2((state) => state.positionerElement)
};

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useSyncedFloatingRootContext.js
function useSyncedFloatingRootContext(options) {
  const {
    popupStore,
    noEmit = false,
    treatPopupAsFloatingElement = false,
    onOpenChange
  } = options;
  const floatingId = useId();
  const nested = useFloatingParentNodeId() != null;
  const open = popupStore.useState("open");
  const referenceElement = popupStore.useState("activeTriggerElement");
  const floatingElement = popupStore.useState(treatPopupAsFloatingElement ? "popupElement" : "positionerElement");
  const triggerElements = popupStore.context.triggerElements;
  const store = useRefWithInit(() => new FloatingRootStore({
    open,
    referenceElement,
    floatingElement,
    triggerElements,
    onOpenChange,
    floatingId,
    nested,
    noEmit
  })).current;
  useIsoLayoutEffect(() => {
    const valuesToSync = {
      open,
      floatingId,
      referenceElement,
      floatingElement
    };
    if (isElement(referenceElement)) {
      valuesToSync.domReferenceElement = referenceElement;
    }
    if (store.state.positionReference === store.state.referenceElement) {
      valuesToSync.positionReference = referenceElement;
    }
    store.update(valuesToSync);
  }, [open, floatingId, referenceElement, floatingElement, store]);
  store.context.onOpenChange = onOpenChange;
  store.context.nested = nested;
  store.context.noEmit = noEmit;
  return store;
}

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useFocus.js
var React28 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useHoverFloatingInteraction.js
var React29 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useHoverInteractionSharedState.js
var interactiveSelector = `button,a,[role="button"],select,[tabindex]:not([tabindex="-1"]),${TYPEABLE_SELECTOR}`;

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useHoverReferenceInteraction.js
var React30 = __toESM(require_react(), 1);
var ReactDOM5 = __toESM(require_react_dom(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useHover.js
var React31 = __toESM(require_react(), 1);
var interactiveSelector2 = `button,[role="button"],select,[tabindex]:not([tabindex="-1"]),${TYPEABLE_SELECTOR}`;

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useInteractions.js
var React32 = __toESM(require_react(), 1);
function useInteractions(propsList = []) {
  const referenceDeps = propsList.map((key) => key == null ? void 0 : key.reference);
  const floatingDeps = propsList.map((key) => key == null ? void 0 : key.floating);
  const itemDeps = propsList.map((key) => key == null ? void 0 : key.item);
  const triggerDeps = propsList.map((key) => key == null ? void 0 : key.trigger);
  const getReferenceProps = React32.useCallback(
    (userProps) => mergeProps2(userProps, propsList, "reference"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    referenceDeps
  );
  const getFloatingProps = React32.useCallback(
    (userProps) => mergeProps2(userProps, propsList, "floating"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    floatingDeps
  );
  const getItemProps = React32.useCallback(
    (userProps) => mergeProps2(userProps, propsList, "item"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    itemDeps
  );
  const getTriggerProps = React32.useCallback(
    (userProps) => mergeProps2(userProps, propsList, "trigger"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    triggerDeps
  );
  return React32.useMemo(() => ({
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    getTriggerProps
  }), [getReferenceProps, getFloatingProps, getItemProps, getTriggerProps]);
}
function mergeProps2(userProps, propsList, elementKey) {
  var _a;
  const eventHandlers = /* @__PURE__ */ new Map();
  const isItem = elementKey === "item";
  const outputProps = {};
  if (elementKey === "floating") {
    outputProps.tabIndex = -1;
    outputProps[FOCUSABLE_ATTRIBUTE] = "";
  }
  for (const key in userProps) {
    if (isItem && userProps) {
      if (key === ACTIVE_KEY || key === SELECTED_KEY) {
        continue;
      }
    }
    outputProps[key] = userProps[key];
  }
  for (let i = 0; i < propsList.length; i += 1) {
    let props;
    const propsOrGetProps = (_a = propsList[i]) == null ? void 0 : _a[elementKey];
    if (typeof propsOrGetProps === "function") {
      props = userProps ? propsOrGetProps(userProps) : null;
    } else {
      props = propsOrGetProps;
    }
    if (!props) {
      continue;
    }
    mutablyMergeProps(outputProps, props, isItem, eventHandlers);
  }
  mutablyMergeProps(outputProps, userProps, isItem, eventHandlers);
  return outputProps;
}
function mutablyMergeProps(outputProps, props, isItem, eventHandlers) {
  var _a;
  for (const key in props) {
    const value = props[key];
    if (isItem && (key === ACTIVE_KEY || key === SELECTED_KEY)) {
      continue;
    }
    if (!key.startsWith("on")) {
      outputProps[key] = value;
    } else {
      if (!eventHandlers.has(key)) {
        eventHandlers.set(key, []);
      }
      if (typeof value === "function") {
        (_a = eventHandlers.get(key)) == null ? void 0 : _a.push(value);
        outputProps[key] = (...args) => {
          var _a2;
          return (_a2 = eventHandlers.get(key)) == null ? void 0 : _a2.map((fn) => fn(...args)).find((val) => val !== void 0);
        };
      }
    }
  }
}

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useListNavigation.js
var React33 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useRole.js
var React34 = __toESM(require_react(), 1);
var componentRoleToAriaRoleMap = /* @__PURE__ */ new Map([["select", "listbox"], ["combobox", "listbox"], ["label", false]]);
function useRole(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const defaultFloatingId = store.useState("floatingId");
  const domReference = store.useState("domReferenceElement");
  const floatingElement = store.useState("floatingElement");
  const {
    role = "dialog"
  } = props;
  const defaultReferenceId = useId();
  const referenceId = (domReference == null ? void 0 : domReference.id) || defaultReferenceId;
  const floatingId = React34.useMemo(() => {
    var _a;
    return ((_a = getFloatingFocusElement(floatingElement)) == null ? void 0 : _a.id) || defaultFloatingId;
  }, [floatingElement, defaultFloatingId]);
  const ariaRole = componentRoleToAriaRoleMap.get(role) ?? role;
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;
  const trigger = React34.useMemo(() => {
    if (ariaRole === "tooltip" || role === "label") {
      return EMPTY_OBJECT;
    }
    return {
      "aria-haspopup": ariaRole === "alertdialog" ? "dialog" : ariaRole,
      "aria-expanded": "false",
      ...ariaRole === "listbox" && {
        role: "combobox"
      },
      ...ariaRole === "menu" && isNested && {
        role: "menuitem"
      },
      ...role === "select" && {
        "aria-autocomplete": "none"
      },
      ...role === "combobox" && {
        "aria-autocomplete": "list"
      }
    };
  }, [ariaRole, isNested, role]);
  const reference = React34.useMemo(() => {
    if (ariaRole === "tooltip" || role === "label") {
      return {
        [`aria-${role === "label" ? "labelledby" : "describedby"}`]: open ? floatingId : void 0
      };
    }
    const triggerProps = trigger;
    return {
      ...triggerProps,
      "aria-expanded": open ? "true" : "false",
      "aria-controls": open ? floatingId : void 0,
      ...ariaRole === "menu" && {
        id: referenceId
      }
    };
  }, [ariaRole, floatingId, open, referenceId, role, trigger]);
  const floating = React34.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      ...ariaRole && {
        role: ariaRole
      }
    };
    if (ariaRole === "tooltip" || role === "label") {
      return floatingProps;
    }
    return {
      ...floatingProps,
      ...ariaRole === "menu" && {
        "aria-labelledby": referenceId
      }
    };
  }, [ariaRole, floatingId, referenceId, role]);
  const item = React34.useCallback(({
    active,
    selected
  }) => {
    const commonProps = {
      role: "option",
      ...active && {
        id: `${floatingId}-fui-option`
      }
    };
    switch (role) {
      case "select":
      case "combobox":
        return {
          ...commonProps,
          "aria-selected": selected
        };
      default:
    }
    return {};
  }, [floatingId, role]);
  return React34.useMemo(() => ({
    reference,
    floating,
    item,
    trigger
  }), [reference, floating, trigger, item]);
}

// node_modules/@base-ui/react/esm/floating-ui-react/hooks/useTypeahead.js
var React35 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/floating-ui-react/safePolygon.js
var CURSOR_SPEED_THRESHOLD = 0.1;
var CURSOR_SPEED_THRESHOLD_SQUARED = CURSOR_SPEED_THRESHOLD * CURSOR_SPEED_THRESHOLD;

// node_modules/@base-ui/react/esm/utils/useOpenInteractionType.js
var React38 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/useEnhancedClickHandler.js
var React36 = __toESM(require_react());
function useEnhancedClickHandler(handler) {
  const lastClickInteractionTypeRef = React36.useRef("");
  const handlePointerDown = React36.useCallback((event) => {
    if (event.defaultPrevented) {
      return;
    }
    lastClickInteractionTypeRef.current = event.pointerType;
    handler(event, event.pointerType);
  }, [handler]);
  const handleClick = React36.useCallback((event) => {
    if (event.detail === 0) {
      handler(event, "keyboard");
      return;
    }
    if ("pointerType" in event) {
      handler(event, event.pointerType);
    } else {
      handler(event, lastClickInteractionTypeRef.current);
    }
    lastClickInteractionTypeRef.current = "";
  }, [handler]);
  return {
    onClick: handleClick,
    onPointerDown: handlePointerDown
  };
}

// node_modules/@base-ui/react/esm/utils/useValueChanged.js
var React37 = __toESM(require_react(), 1);
function useValueChanged(value, onChange) {
  const valueRef = React37.useRef(value);
  const onChangeCallback = useStableCallback(onChange);
  useIsoLayoutEffect(() => {
    if (valueRef.current === value) {
      return;
    }
    onChangeCallback(valueRef.current);
  }, [value, onChangeCallback]);
  useIsoLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);
}

// node_modules/@base-ui/react/esm/utils/useOpenInteractionType.js
function useOpenInteractionType(open) {
  const [openMethod, setOpenMethod] = React38.useState(null);
  const handleTriggerClick = useStableCallback((_, interactionType) => {
    if (!open) {
      setOpenMethod(interactionType || // On iOS Safari, the hitslop around touch targets means tapping outside an element's
      // bounds does not fire `pointerdown` but does fire `mousedown`. The `interactionType`
      // will be "" in that case.
      (isIOS ? "touch" : ""));
    }
  });
  useValueChanged(open, (previousOpen) => {
    if (previousOpen && !open) {
      setOpenMethod(null);
    }
  });
  const {
    onClick,
    onPointerDown
  } = useEnhancedClickHandler(handleTriggerClick);
  return React38.useMemo(() => ({
    openMethod,
    triggerProps: {
      onClick,
      onPointerDown
    }
  }), [openMethod, onClick, onPointerDown]);
}

// node_modules/@base-ui/react/esm/dialog/root/useDialogRoot.js
function useDialogRoot(params) {
  const {
    store,
    parentContext,
    actionsRef
  } = params;
  const open = store.useState("open");
  const disablePointerDismissal = store.useState("disablePointerDismissal");
  const modal = store.useState("modal");
  const popupElement = store.useState("popupElement");
  const {
    openMethod,
    triggerProps
  } = useOpenInteractionType(open);
  useImplicitActiveTrigger(store);
  const {
    forceUnmount
  } = useOpenStateTransitions(open, store);
  const createDialogEventDetails = useStableCallback((reason) => {
    const details = createChangeEventDetails(reason);
    details.preventUnmountOnClose = () => {
      store.set("preventUnmountingOnClose", true);
    };
    return details;
  });
  const handleImperativeClose = React39.useCallback(() => {
    store.setOpen(false, createDialogEventDetails(reason_parts_exports.imperativeAction));
  }, [store, createDialogEventDetails]);
  React39.useImperativeHandle(actionsRef, () => ({
    unmount: forceUnmount,
    close: handleImperativeClose
  }), [forceUnmount, handleImperativeClose]);
  const floatingRootContext = useSyncedFloatingRootContext({
    popupStore: store,
    onOpenChange: store.setOpen,
    treatPopupAsFloatingElement: true,
    noEmit: true
  });
  const [ownNestedOpenDialogs, setOwnNestedOpenDialogs] = React39.useState(0);
  const isTopmost = ownNestedOpenDialogs === 0;
  const role = useRole(floatingRootContext);
  const dismiss = useDismiss(floatingRootContext, {
    outsidePressEvent() {
      if (store.context.internalBackdropRef.current || store.context.backdropRef.current) {
        return "intentional";
      }
      return {
        mouse: modal === "trap-focus" ? "sloppy" : "intentional",
        touch: "sloppy"
      };
    },
    outsidePress(event) {
      if (!store.context.outsidePressEnabledRef.current) {
        return false;
      }
      if ("button" in event && event.button !== 0) {
        return false;
      }
      if ("touches" in event && event.touches.length !== 1) {
        return false;
      }
      const target = getTarget(event);
      if (isTopmost && !disablePointerDismissal) {
        const eventTarget = target;
        if (modal) {
          return store.context.internalBackdropRef.current || store.context.backdropRef.current ? store.context.internalBackdropRef.current === eventTarget || store.context.backdropRef.current === eventTarget || contains(eventTarget, popupElement) && !(eventTarget == null ? void 0 : eventTarget.hasAttribute("data-base-ui-portal")) : true;
        }
        return true;
      }
      return false;
    },
    escapeKey: isTopmost
  });
  useScrollLock(open && modal === true, popupElement);
  const {
    getReferenceProps,
    getFloatingProps,
    getTriggerProps
  } = useInteractions([role, dismiss]);
  store.useContextCallback("onNestedDialogOpen", (ownChildrenCount) => {
    setOwnNestedOpenDialogs(ownChildrenCount + 1);
  });
  store.useContextCallback("onNestedDialogClose", () => {
    setOwnNestedOpenDialogs(0);
  });
  React39.useEffect(() => {
    if ((parentContext == null ? void 0 : parentContext.onNestedDialogOpen) && open) {
      parentContext.onNestedDialogOpen(ownNestedOpenDialogs);
    }
    if ((parentContext == null ? void 0 : parentContext.onNestedDialogClose) && !open) {
      parentContext.onNestedDialogClose();
    }
    return () => {
      if ((parentContext == null ? void 0 : parentContext.onNestedDialogClose) && open) {
        parentContext.onNestedDialogClose();
      }
    };
  }, [open, parentContext, ownNestedOpenDialogs]);
  const activeTriggerProps = React39.useMemo(() => getReferenceProps(triggerProps), [getReferenceProps, triggerProps]);
  const inactiveTriggerProps = React39.useMemo(() => getTriggerProps(triggerProps), [getTriggerProps, triggerProps]);
  const popupProps = React39.useMemo(() => getFloatingProps(), [getFloatingProps]);
  store.useSyncedValues({
    openMethod,
    activeTriggerProps,
    inactiveTriggerProps,
    popupProps,
    floatingRootContext,
    nestedOpenDialogCount: ownNestedOpenDialogs
  });
}

// node_modules/@base-ui/react/esm/dialog/root/DialogRootContext.js
var React40 = __toESM(require_react(), 1);
var DialogRootContext = React40.createContext(void 0);
if (true) DialogRootContext.displayName = "DialogRootContext";
function useDialogRootContext(optional) {
  const dialogRootContext = React40.useContext(DialogRootContext);
  if (optional === false && dialogRootContext === void 0) {
    throw new Error(true ? "Base UI: DialogRootContext is missing. Dialog parts must be placed within <Dialog.Root>." : formatErrorMessage_default(27));
  }
  return dialogRootContext;
}

// node_modules/@base-ui/react/esm/dialog/store/DialogStore.js
var React41 = __toESM(require_react(), 1);
var selectors2 = {
  ...popupStoreSelectors,
  modal: createSelector2((state) => state.modal),
  nested: createSelector2((state) => state.nested),
  nestedOpenDialogCount: createSelector2((state) => state.nestedOpenDialogCount),
  disablePointerDismissal: createSelector2((state) => state.disablePointerDismissal),
  openMethod: createSelector2((state) => state.openMethod),
  descriptionElementId: createSelector2((state) => state.descriptionElementId),
  titleElementId: createSelector2((state) => state.titleElementId),
  viewportElement: createSelector2((state) => state.viewportElement),
  role: createSelector2((state) => state.role)
};
var DialogStore = class extends ReactStore {
  constructor(initialState) {
    super(createInitialState(initialState), {
      popupRef: React41.createRef(),
      backdropRef: React41.createRef(),
      internalBackdropRef: React41.createRef(),
      outsidePressEnabledRef: {
        current: true
      },
      triggerElements: new PopupTriggerMap(),
      onOpenChange: void 0,
      onOpenChangeComplete: void 0
    }, selectors2);
    __publicField(this, "setOpen", (nextOpen, eventDetails) => {
      var _a, _b, _c, _d;
      eventDetails.preventUnmountOnClose = () => {
        this.set("preventUnmountingOnClose", true);
      };
      if (!nextOpen && eventDetails.trigger == null && this.state.activeTriggerId != null) {
        eventDetails.trigger = this.state.activeTriggerElement ?? void 0;
      }
      (_b = (_a = this.context).onOpenChange) == null ? void 0 : _b.call(_a, nextOpen, eventDetails);
      if (eventDetails.isCanceled) {
        return;
      }
      const details = {
        open: nextOpen,
        nativeEvent: eventDetails.event,
        reason: eventDetails.reason,
        nested: this.state.nested
      };
      (_c = this.state.floatingRootContext.context.events) == null ? void 0 : _c.emit("openchange", details);
      const updatedState = {
        open: nextOpen
      };
      const newTriggerId = ((_d = eventDetails.trigger) == null ? void 0 : _d.id) ?? null;
      if (newTriggerId || nextOpen) {
        updatedState.activeTriggerId = newTriggerId;
        updatedState.activeTriggerElement = eventDetails.trigger ?? null;
      }
      this.update(updatedState);
    });
  }
};
function createInitialState(initialState = {}) {
  return {
    ...createInitialPopupStoreState(),
    modal: true,
    disablePointerDismissal: false,
    popupElement: null,
    viewportElement: null,
    descriptionElementId: void 0,
    titleElementId: void 0,
    openMethod: null,
    nested: false,
    nestedOpenDialogCount: 0,
    role: "dialog",
    ...initialState
  };
}

// node_modules/@base-ui/react/esm/alert-dialog/root/AlertDialogRoot.js
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
function AlertDialogRoot(props) {
  const {
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onOpenChangeComplete,
    actionsRef,
    handle,
    triggerId: triggerIdProp,
    defaultTriggerId: defaultTriggerIdProp = null
  } = props;
  const parentDialogRootContext = useDialogRootContext();
  const nested = Boolean(parentDialogRootContext);
  const store = useRefWithInit(() => {
    return (handle == null ? void 0 : handle.store) ?? new DialogStore({
      open: defaultOpen,
      openProp,
      activeTriggerId: defaultTriggerIdProp,
      triggerIdProp,
      modal: true,
      disablePointerDismissal: true,
      nested,
      role: "alertdialog"
    });
  }).current;
  store.useControlledProp("openProp", openProp);
  store.useControlledProp("triggerIdProp", triggerIdProp);
  store.useSyncedValue("nested", nested);
  store.useContextCallback("onOpenChange", onOpenChange);
  store.useContextCallback("onOpenChangeComplete", onOpenChangeComplete);
  const payload = store.useState("payload");
  useDialogRoot({
    store,
    actionsRef,
    parentContext: parentDialogRootContext == null ? void 0 : parentDialogRootContext.store.context,
    onOpenChange,
    triggerIdProp
  });
  const contextValue = React42.useMemo(() => ({
    store
  }), [store]);
  return (0, import_jsx_runtime7.jsx)(DialogRootContext.Provider, {
    value: contextValue,
    children: typeof children === "function" ? children({
      payload
    }) : children
  });
}

// node_modules/@base-ui/react/esm/dialog/backdrop/DialogBackdrop.js
var React43 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/utils/popupStateMapping.js
var CommonPopupDataAttributes = (function(CommonPopupDataAttributes2) {
  CommonPopupDataAttributes2["open"] = "data-open";
  CommonPopupDataAttributes2["closed"] = "data-closed";
  CommonPopupDataAttributes2[CommonPopupDataAttributes2["startingStyle"] = TransitionStatusDataAttributes.startingStyle] = "startingStyle";
  CommonPopupDataAttributes2[CommonPopupDataAttributes2["endingStyle"] = TransitionStatusDataAttributes.endingStyle] = "endingStyle";
  CommonPopupDataAttributes2["anchorHidden"] = "data-anchor-hidden";
  CommonPopupDataAttributes2["side"] = "data-side";
  CommonPopupDataAttributes2["align"] = "data-align";
  return CommonPopupDataAttributes2;
})({});
var CommonTriggerDataAttributes = (function(CommonTriggerDataAttributes2) {
  CommonTriggerDataAttributes2["popupOpen"] = "data-popup-open";
  CommonTriggerDataAttributes2["pressed"] = "data-pressed";
  return CommonTriggerDataAttributes2;
})({});
var TRIGGER_HOOK = {
  [CommonTriggerDataAttributes.popupOpen]: ""
};
var PRESSABLE_TRIGGER_HOOK = {
  [CommonTriggerDataAttributes.popupOpen]: "",
  [CommonTriggerDataAttributes.pressed]: ""
};
var POPUP_OPEN_HOOK = {
  [CommonPopupDataAttributes.open]: ""
};
var POPUP_CLOSED_HOOK = {
  [CommonPopupDataAttributes.closed]: ""
};
var ANCHOR_HIDDEN_HOOK = {
  [CommonPopupDataAttributes.anchorHidden]: ""
};
var triggerOpenStateMapping = {
  open(value) {
    if (value) {
      return TRIGGER_HOOK;
    }
    return null;
  }
};
var popupStateMapping = {
  open(value) {
    if (value) {
      return POPUP_OPEN_HOOK;
    }
    return POPUP_CLOSED_HOOK;
  },
  anchorHidden(value) {
    if (value) {
      return ANCHOR_HIDDEN_HOOK;
    }
    return null;
  }
};

// node_modules/@base-ui/react/esm/dialog/backdrop/DialogBackdrop.js
var stateAttributesMapping = {
  ...popupStateMapping,
  ...transitionStatusMapping
};
var DialogBackdrop = React43.forwardRef(function DialogBackdrop2(componentProps, forwardedRef) {
  const {
    render,
    className,
    forceRender = false,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const open = store.useState("open");
  const nested = store.useState("nested");
  const mounted = store.useState("mounted");
  const transitionStatus = store.useState("transitionStatus");
  const state = {
    open,
    transitionStatus
  };
  return useRenderElement("div", componentProps, {
    state,
    ref: [store.context.backdropRef, forwardedRef],
    stateAttributesMapping,
    props: [{
      role: "presentation",
      hidden: !mounted,
      style: {
        userSelect: "none",
        WebkitUserSelect: "none"
      }
    }, elementProps],
    enabled: forceRender || !nested
  });
});
if (true) DialogBackdrop.displayName = "DialogBackdrop";

// node_modules/@base-ui/react/esm/dialog/close/DialogClose.js
var React47 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/use-button/useButton.js
var React46 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/error.js
var set2;
if (true) {
  set2 = /* @__PURE__ */ new Set();
}
function error(...messages) {
  if (true) {
    const messageKey = messages.join(" ");
    if (!set2.has(messageKey)) {
      set2.add(messageKey);
      console.error(`Base UI: ${messageKey}`);
    }
  }
}

// node_modules/@base-ui/react/esm/composite/root/CompositeRootContext.js
var React44 = __toESM(require_react(), 1);
var CompositeRootContext = React44.createContext(void 0);
if (true) CompositeRootContext.displayName = "CompositeRootContext";
function useCompositeRootContext(optional = false) {
  const context = React44.useContext(CompositeRootContext);
  if (context === void 0 && !optional) {
    throw new Error(true ? "Base UI: CompositeRootContext is missing. Composite parts must be placed within <Composite.Root>." : formatErrorMessage_default(16));
  }
  return context;
}

// node_modules/@base-ui/react/esm/utils/useFocusableWhenDisabled.js
var React45 = __toESM(require_react(), 1);
function useFocusableWhenDisabled(parameters) {
  const {
    focusableWhenDisabled,
    disabled: disabled2,
    composite = false,
    tabIndex: tabIndexProp = 0,
    isNativeButton
  } = parameters;
  const isFocusableComposite = composite && focusableWhenDisabled !== false;
  const isNonFocusableComposite = composite && focusableWhenDisabled === false;
  const props = React45.useMemo(() => {
    const additionalProps = {
      // allow Tabbing away from focusableWhenDisabled elements
      onKeyDown(event) {
        if (disabled2 && focusableWhenDisabled && event.key !== "Tab") {
          event.preventDefault();
        }
      }
    };
    if (!composite) {
      additionalProps.tabIndex = tabIndexProp;
      if (!isNativeButton && disabled2) {
        additionalProps.tabIndex = focusableWhenDisabled ? tabIndexProp : -1;
      }
    }
    if (isNativeButton && (focusableWhenDisabled || isFocusableComposite) || !isNativeButton && disabled2) {
      additionalProps["aria-disabled"] = disabled2;
    }
    if (isNativeButton && (!focusableWhenDisabled || isNonFocusableComposite)) {
      additionalProps.disabled = disabled2;
    }
    return additionalProps;
  }, [composite, disabled2, focusableWhenDisabled, isFocusableComposite, isNonFocusableComposite, isNativeButton, tabIndexProp]);
  return {
    props
  };
}

// node_modules/@base-ui/react/esm/use-button/useButton.js
function useButton(parameters = {}) {
  const {
    disabled: disabled2 = false,
    focusableWhenDisabled,
    tabIndex = 0,
    native: isNativeButton = true,
    composite: compositeProp
  } = parameters;
  const elementRef = React46.useRef(null);
  const compositeRootContext = useCompositeRootContext(true);
  const isCompositeItem = compositeProp ?? compositeRootContext !== void 0;
  const {
    props: focusableWhenDisabledProps
  } = useFocusableWhenDisabled({
    focusableWhenDisabled,
    disabled: disabled2,
    composite: isCompositeItem,
    tabIndex,
    isNativeButton
  });
  if (true) {
    React46.useEffect(() => {
      var _a, _b, _c, _d;
      if (!elementRef.current) {
        return;
      }
      const isButtonTag = isButtonElement(elementRef.current);
      if (isNativeButton) {
        if (!isButtonTag) {
          const ownerStackMessage = ((_b = (_a = SafeReact).captureOwnerStack) == null ? void 0 : _b.call(_a)) || "";
          const message = "A component that acts as a button expected a native <button> because the `nativeButton` prop is true. Rendering a non-<button> removes native button semantics, which can impact forms and accessibility. Use a real <button> in the `render` prop, or set `nativeButton` to `false`.";
          error(`${message}${ownerStackMessage}`);
        }
      } else if (isButtonTag) {
        const ownerStackMessage = ((_d = (_c = SafeReact).captureOwnerStack) == null ? void 0 : _d.call(_c)) || "";
        const message = "A component that acts as a button expected a non-<button> because the `nativeButton` prop is false. Rendering a <button> keeps native behavior while Base UI applies non-native attributes and handlers, which can add unintended extra attributes (such as `role` or `aria-disabled`). Use a non-<button> in the `render` prop, or set `nativeButton` to `true`.";
        error(`${message}${ownerStackMessage}`);
      }
    }, [isNativeButton]);
  }
  const updateDisabled = React46.useCallback(() => {
    const element = elementRef.current;
    if (!isButtonElement(element)) {
      return;
    }
    if (isCompositeItem && disabled2 && focusableWhenDisabledProps.disabled === void 0 && element.disabled) {
      element.disabled = false;
    }
  }, [disabled2, focusableWhenDisabledProps.disabled, isCompositeItem]);
  useIsoLayoutEffect(updateDisabled, [updateDisabled]);
  const getButtonProps = React46.useCallback((externalProps = {}) => {
    const {
      onClick: externalOnClick,
      onMouseDown: externalOnMouseDown,
      onKeyUp: externalOnKeyUp,
      onKeyDown: externalOnKeyDown,
      onPointerDown: externalOnPointerDown,
      ...otherExternalProps
    } = externalProps;
    const type = isNativeButton ? "button" : void 0;
    return mergeProps({
      type,
      onClick(event) {
        if (disabled2) {
          event.preventDefault();
          return;
        }
        externalOnClick == null ? void 0 : externalOnClick(event);
      },
      onMouseDown(event) {
        if (!disabled2) {
          externalOnMouseDown == null ? void 0 : externalOnMouseDown(event);
        }
      },
      onKeyDown(event) {
        if (disabled2) {
          return;
        }
        makeEventPreventable(event);
        externalOnKeyDown == null ? void 0 : externalOnKeyDown(event);
        if (event.baseUIHandlerPrevented) {
          return;
        }
        const isCurrentTarget = event.target === event.currentTarget;
        const currentTarget = event.currentTarget;
        const isButton = isButtonElement(currentTarget);
        const isLink = !isNativeButton && isValidLinkElement(currentTarget);
        const shouldClick = isCurrentTarget && (isNativeButton ? isButton : !isLink);
        const isEnterKey = event.key === "Enter";
        const isSpaceKey = event.key === " ";
        const role = currentTarget.getAttribute("role");
        const isTextNavigationRole = (role == null ? void 0 : role.startsWith("menuitem")) || role === "option" || role === "gridcell";
        if (isCurrentTarget && isCompositeItem && isSpaceKey) {
          if (event.defaultPrevented && isTextNavigationRole) {
            return;
          }
          event.preventDefault();
          if (isLink || isNativeButton && isButton) {
            currentTarget.click();
            event.preventBaseUIHandler();
          } else if (shouldClick) {
            externalOnClick == null ? void 0 : externalOnClick(event);
            event.preventBaseUIHandler();
          }
          return;
        }
        if (shouldClick) {
          if (!isNativeButton && (isSpaceKey || isEnterKey)) {
            event.preventDefault();
          }
          if (!isNativeButton && isEnterKey) {
            externalOnClick == null ? void 0 : externalOnClick(event);
          }
        }
      },
      onKeyUp(event) {
        if (disabled2) {
          return;
        }
        makeEventPreventable(event);
        externalOnKeyUp == null ? void 0 : externalOnKeyUp(event);
        if (event.target === event.currentTarget && isNativeButton && isCompositeItem && isButtonElement(event.currentTarget) && event.key === " ") {
          event.preventDefault();
          return;
        }
        if (event.baseUIHandlerPrevented) {
          return;
        }
        if (event.target === event.currentTarget && !isNativeButton && !isCompositeItem && event.key === " ") {
          externalOnClick == null ? void 0 : externalOnClick(event);
        }
      },
      onPointerDown(event) {
        if (disabled2) {
          event.preventDefault();
          return;
        }
        externalOnPointerDown == null ? void 0 : externalOnPointerDown(event);
      }
    }, !isNativeButton ? {
      role: "button"
    } : void 0, focusableWhenDisabledProps, otherExternalProps);
  }, [disabled2, focusableWhenDisabledProps, isCompositeItem, isNativeButton]);
  const buttonRef = useStableCallback((element) => {
    elementRef.current = element;
    updateDisabled();
  });
  return {
    getButtonProps,
    buttonRef
  };
}
function isButtonElement(elem) {
  return isHTMLElement(elem) && elem.tagName === "BUTTON";
}
function isValidLinkElement(elem) {
  return Boolean((elem == null ? void 0 : elem.tagName) === "A" && (elem == null ? void 0 : elem.href));
}

// node_modules/@base-ui/react/esm/dialog/close/DialogClose.js
var DialogClose = React47.forwardRef(function DialogClose2(componentProps, forwardedRef) {
  const {
    render,
    className,
    disabled: disabled2 = false,
    nativeButton = true,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const open = store.useState("open");
  function handleClick(event) {
    if (open) {
      store.setOpen(false, createChangeEventDetails(reason_parts_exports.closePress, event.nativeEvent));
    }
  }
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled: disabled2,
    native: nativeButton
  });
  const state = {
    disabled: disabled2
  };
  return useRenderElement("button", componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [{
      onClick: handleClick
    }, elementProps, getButtonProps]
  });
});
if (true) DialogClose.displayName = "DialogClose";

// node_modules/@base-ui/react/esm/dialog/description/DialogDescription.js
var React48 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/utils/useBaseUiId.js
function useBaseUiId(idOverride) {
  return useId(idOverride, "base-ui");
}

// node_modules/@base-ui/react/esm/dialog/description/DialogDescription.js
var DialogDescription = React48.forwardRef(function DialogDescription2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const id = useBaseUiId(idProp);
  store.useSyncedValueWithCleanup("descriptionElementId", id);
  return useRenderElement("p", componentProps, {
    ref: forwardedRef,
    props: [{
      id
    }, elementProps]
  });
});
if (true) DialogDescription.displayName = "DialogDescription";

// node_modules/@base-ui/react/esm/dialog/popup/DialogPopup.js
var React50 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/dialog/popup/DialogPopupCssVars.js
var DialogPopupCssVars = (function(DialogPopupCssVars2) {
  DialogPopupCssVars2["nestedDialogs"] = "--nested-dialogs";
  return DialogPopupCssVars2;
})({});

// node_modules/@base-ui/react/esm/dialog/popup/DialogPopupDataAttributes.js
var DialogPopupDataAttributes = (function(DialogPopupDataAttributes2) {
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["open"] = CommonPopupDataAttributes.open] = "open";
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["closed"] = CommonPopupDataAttributes.closed] = "closed";
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["startingStyle"] = CommonPopupDataAttributes.startingStyle] = "startingStyle";
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["endingStyle"] = CommonPopupDataAttributes.endingStyle] = "endingStyle";
  DialogPopupDataAttributes2["nested"] = "data-nested";
  DialogPopupDataAttributes2["nestedDialogOpen"] = "data-nested-dialog-open";
  return DialogPopupDataAttributes2;
})({});

// node_modules/@base-ui/react/esm/dialog/portal/DialogPortalContext.js
var React49 = __toESM(require_react(), 1);
var DialogPortalContext = React49.createContext(void 0);
if (true) DialogPortalContext.displayName = "DialogPortalContext";
function useDialogPortalContext() {
  const value = React49.useContext(DialogPortalContext);
  if (value === void 0) {
    throw new Error(true ? "Base UI: <Dialog.Portal> is missing." : formatErrorMessage_default(26));
  }
  return value;
}

// node_modules/@base-ui/react/esm/composite/composite.js
var ARROW_UP2 = "ArrowUp";
var ARROW_DOWN2 = "ArrowDown";
var ARROW_LEFT2 = "ArrowLeft";
var ARROW_RIGHT2 = "ArrowRight";
var HOME = "Home";
var END = "End";
var HORIZONTAL_KEYS = /* @__PURE__ */ new Set([ARROW_LEFT2, ARROW_RIGHT2]);
var VERTICAL_KEYS = /* @__PURE__ */ new Set([ARROW_UP2, ARROW_DOWN2]);
var ARROW_KEYS = /* @__PURE__ */ new Set([...HORIZONTAL_KEYS, ...VERTICAL_KEYS]);
var ALL_KEYS = /* @__PURE__ */ new Set([...ARROW_KEYS, HOME, END]);
var COMPOSITE_KEYS = /* @__PURE__ */ new Set([ARROW_UP2, ARROW_DOWN2, ARROW_LEFT2, ARROW_RIGHT2, HOME, END]);

// node_modules/@base-ui/react/esm/dialog/popup/DialogPopup.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var stateAttributesMapping2 = {
  ...popupStateMapping,
  ...transitionStatusMapping,
  nestedDialogOpen(value) {
    return value ? {
      [DialogPopupDataAttributes.nestedDialogOpen]: ""
    } : null;
  }
};
var DialogPopup = React50.forwardRef(function DialogPopup2(componentProps, forwardedRef) {
  const {
    className,
    finalFocus,
    initialFocus,
    render,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const descriptionElementId = store.useState("descriptionElementId");
  const disablePointerDismissal = store.useState("disablePointerDismissal");
  const floatingRootContext = store.useState("floatingRootContext");
  const rootPopupProps = store.useState("popupProps");
  const modal = store.useState("modal");
  const mounted = store.useState("mounted");
  const nested = store.useState("nested");
  const nestedOpenDialogCount = store.useState("nestedOpenDialogCount");
  const open = store.useState("open");
  const openMethod = store.useState("openMethod");
  const titleElementId = store.useState("titleElementId");
  const transitionStatus = store.useState("transitionStatus");
  const role = store.useState("role");
  useDialogPortalContext();
  useOpenChangeComplete({
    open,
    ref: store.context.popupRef,
    onComplete() {
      var _a, _b;
      if (open) {
        (_b = (_a = store.context).onOpenChangeComplete) == null ? void 0 : _b.call(_a, true);
      }
    }
  });
  function defaultInitialFocus(interactionType) {
    if (interactionType === "touch") {
      return store.context.popupRef.current;
    }
    return true;
  }
  const resolvedInitialFocus = initialFocus === void 0 ? defaultInitialFocus : initialFocus;
  const nestedDialogOpen = nestedOpenDialogCount > 0;
  const state = {
    open,
    nested,
    transitionStatus,
    nestedDialogOpen
  };
  const element = useRenderElement("div", componentProps, {
    state,
    props: [rootPopupProps, {
      "aria-labelledby": titleElementId ?? void 0,
      "aria-describedby": descriptionElementId ?? void 0,
      role,
      tabIndex: -1,
      hidden: !mounted,
      onKeyDown(event) {
        if (COMPOSITE_KEYS.has(event.key)) {
          event.stopPropagation();
        }
      },
      style: {
        [DialogPopupCssVars.nestedDialogs]: nestedOpenDialogCount
      }
    }, elementProps],
    ref: [forwardedRef, store.context.popupRef, store.useStateSetter("popupElement")],
    stateAttributesMapping: stateAttributesMapping2
  });
  return (0, import_jsx_runtime8.jsx)(FloatingFocusManager, {
    context: floatingRootContext,
    openInteractionType: openMethod,
    disabled: !mounted,
    closeOnFocusOut: !disablePointerDismissal,
    initialFocus: resolvedInitialFocus,
    returnFocus: finalFocus,
    modal: modal !== false,
    restoreFocus: "popup",
    children: element
  });
});
if (true) DialogPopup.displayName = "DialogPopup";

// node_modules/@base-ui/react/esm/dialog/portal/DialogPortal.js
var React52 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/inertValue.js
function inertValue(value) {
  if (isReactVersionAtLeast(19)) {
    return value;
  }
  return value ? "true" : void 0;
}

// node_modules/@base-ui/react/esm/utils/InternalBackdrop.js
var React51 = __toESM(require_react(), 1);
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var InternalBackdrop = React51.forwardRef(function InternalBackdrop2(props, ref) {
  const {
    cutout,
    ...otherProps
  } = props;
  let clipPath;
  if (cutout) {
    const rect = cutout == null ? void 0 : cutout.getBoundingClientRect();
    clipPath = `polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${rect.left}px ${rect.top}px,
      ${rect.left}px ${rect.bottom}px,
      ${rect.right}px ${rect.bottom}px,
      ${rect.right}px ${rect.top}px,
      ${rect.left}px ${rect.top}px
    )`;
  }
  return (0, import_jsx_runtime9.jsx)("div", {
    ref,
    role: "presentation",
    "data-base-ui-inert": "",
    ...otherProps,
    style: {
      position: "fixed",
      inset: 0,
      userSelect: "none",
      WebkitUserSelect: "none",
      clipPath
    }
  });
});
if (true) InternalBackdrop.displayName = "InternalBackdrop";

// node_modules/@base-ui/react/esm/dialog/portal/DialogPortal.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
var DialogPortal = React52.forwardRef(function DialogPortal2(props, forwardedRef) {
  const {
    keepMounted = false,
    ...portalProps
  } = props;
  const {
    store
  } = useDialogRootContext();
  const mounted = store.useState("mounted");
  const modal = store.useState("modal");
  const open = store.useState("open");
  const shouldRender = mounted || keepMounted;
  if (!shouldRender) {
    return null;
  }
  return (0, import_jsx_runtime10.jsx)(DialogPortalContext.Provider, {
    value: keepMounted,
    children: (0, import_jsx_runtime10.jsxs)(FloatingPortal, {
      ref: forwardedRef,
      ...portalProps,
      children: [mounted && modal === true && (0, import_jsx_runtime10.jsx)(InternalBackdrop, {
        ref: store.context.internalBackdropRef,
        inert: inertValue(!open)
      }), props.children]
    })
  });
});
if (true) DialogPortal.displayName = "DialogPortal";

// node_modules/@base-ui/react/esm/dialog/title/DialogTitle.js
var React53 = __toESM(require_react(), 1);
var DialogTitle = React53.forwardRef(function DialogTitle2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const id = useBaseUiId(idProp);
  store.useSyncedValueWithCleanup("titleElementId", id);
  return useRenderElement("h2", componentProps, {
    ref: forwardedRef,
    props: [{
      id
    }, elementProps]
  });
});
if (true) DialogTitle.displayName = "DialogTitle";

// node_modules/@base-ui/react/esm/dialog/trigger/DialogTrigger.js
var React54 = __toESM(require_react(), 1);
var DialogTrigger = React54.forwardRef(function DialogTrigger2(componentProps, forwardedRef) {
  const {
    render,
    className,
    disabled: disabled2 = false,
    nativeButton = true,
    id: idProp,
    payload,
    handle,
    ...elementProps
  } = componentProps;
  const dialogRootContext = useDialogRootContext(true);
  const store = (handle == null ? void 0 : handle.store) ?? (dialogRootContext == null ? void 0 : dialogRootContext.store);
  if (!store) {
    throw new Error(true ? "Base UI: <Dialog.Trigger> must be used within <Dialog.Root> or provided with a handle." : formatErrorMessage_default(79));
  }
  const thisTriggerId = useBaseUiId(idProp);
  const floatingContext = store.useState("floatingRootContext");
  const isOpenedByThisTrigger = store.useState("isOpenedByTrigger", thisTriggerId);
  const triggerElementRef = React54.useRef(null);
  const {
    registerTrigger,
    isMountedByThisTrigger
  } = useTriggerDataForwarding(thisTriggerId, triggerElementRef, store, {
    payload
  });
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled: disabled2,
    native: nativeButton
  });
  const click = useClick(floatingContext, {
    enabled: floatingContext != null
  });
  const localInteractionProps = useInteractions([click]);
  const state = {
    disabled: disabled2,
    open: isOpenedByThisTrigger
  };
  const rootTriggerProps = store.useState("triggerProps", isMountedByThisTrigger);
  return useRenderElement("button", componentProps, {
    state,
    ref: [buttonRef, forwardedRef, registerTrigger, triggerElementRef],
    props: [localInteractionProps.getReferenceProps(), rootTriggerProps, {
      [CLICK_TRIGGER_IDENTIFIER]: "",
      id: thisTriggerId
    }, elementProps, getButtonProps],
    stateAttributesMapping: triggerOpenStateMapping
  });
});
if (true) DialogTrigger.displayName = "DialogTrigger";

// node_modules/@base-ui/react/esm/dialog/viewport/DialogViewport.js
var React55 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/dialog/viewport/DialogViewportDataAttributes.js
var DialogViewportDataAttributes = (function(DialogViewportDataAttributes2) {
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["open"] = CommonPopupDataAttributes.open] = "open";
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["closed"] = CommonPopupDataAttributes.closed] = "closed";
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["startingStyle"] = CommonPopupDataAttributes.startingStyle] = "startingStyle";
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["endingStyle"] = CommonPopupDataAttributes.endingStyle] = "endingStyle";
  DialogViewportDataAttributes2["nested"] = "data-nested";
  DialogViewportDataAttributes2["nestedDialogOpen"] = "data-nested-dialog-open";
  return DialogViewportDataAttributes2;
})({});

// node_modules/@base-ui/react/esm/dialog/viewport/DialogViewport.js
var stateAttributesMapping3 = {
  ...popupStateMapping,
  ...transitionStatusMapping,
  nested(value) {
    return value ? {
      [DialogViewportDataAttributes.nested]: ""
    } : null;
  },
  nestedDialogOpen(value) {
    return value ? {
      [DialogViewportDataAttributes.nestedDialogOpen]: ""
    } : null;
  }
};
var DialogViewport = React55.forwardRef(function DialogViewport2(componentProps, forwardedRef) {
  const {
    className,
    render,
    children,
    ...elementProps
  } = componentProps;
  const keepMounted = useDialogPortalContext();
  const {
    store
  } = useDialogRootContext();
  const open = store.useState("open");
  const nested = store.useState("nested");
  const transitionStatus = store.useState("transitionStatus");
  const nestedOpenDialogCount = store.useState("nestedOpenDialogCount");
  const mounted = store.useState("mounted");
  const nestedDialogOpen = nestedOpenDialogCount > 0;
  const state = {
    open,
    nested,
    transitionStatus,
    nestedDialogOpen
  };
  const shouldRender = keepMounted || mounted;
  return useRenderElement("div", componentProps, {
    enabled: shouldRender,
    state,
    ref: [forwardedRef, store.useStateSetter("viewportElement")],
    stateAttributesMapping: stateAttributesMapping3,
    props: [{
      role: "presentation",
      hidden: !mounted,
      style: {
        pointerEvents: !open ? "none" : void 0
      },
      children
    }, elementProps]
  });
});
if (true) DialogViewport.displayName = "DialogViewport";

// node_modules/@base-ui/react/esm/dialog/store/DialogHandle.js
var DialogHandle = class {
  /**
   * Internal store holding the dialog state.
   * @internal
   */
  constructor(store) {
    this.store = store ?? new DialogStore();
  }
  /**
   * Opens the dialog and associates it with the trigger with the given id.
   * The trigger, if provided, must be a Dialog.Trigger component with this handle passed as a prop.
   *
   * This method should only be called in an event handler or an effect (not during rendering).
   *
   * @param triggerId ID of the trigger to associate with the dialog. If null, the dialog will open without a trigger association.
   */
  open(triggerId) {
    const triggerElement = triggerId ? this.store.context.triggerElements.getById(triggerId) : void 0;
    if (true) {
      if (triggerId && !triggerElement) {
        console.warn(`Base UI: DialogHandle.open: No trigger found with id "${triggerId}". The dialog will open, but the trigger will not be associated with the dialog.`);
      }
    }
    this.store.setOpen(true, createChangeEventDetails(reason_parts_exports.imperativeAction, void 0, triggerElement));
  }
  /**
   * Opens the dialog and sets the payload.
   * Does not associate the dialog with any trigger.
   *
   * @param payload Payload to set when opening the dialog.
   */
  openWithPayload(payload) {
    this.store.set("payload", payload);
    this.store.setOpen(true, createChangeEventDetails(reason_parts_exports.imperativeAction, void 0, void 0));
  }
  /**
   * Closes the dialog.
   */
  close() {
    this.store.setOpen(false, createChangeEventDetails(reason_parts_exports.imperativeAction, void 0, void 0));
  }
  /**
   * Indicates whether the dialog is currently open.
   */
  get isOpen() {
    return this.store.state.open;
  }
};

// node_modules/@base-ui/react/esm/alert-dialog/handle.js
function createAlertDialogHandle() {
  return new DialogHandle(new DialogStore({
    modal: true,
    disablePointerDismissal: true,
    role: "alertdialog"
  }));
}
export {
  index_parts_exports as AlertDialog
};
/*! Bundled license information:

tabbable/dist/index.esm.js:
  (*!
  * tabbable 6.4.0
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  *)
*/
//# sourceMappingURL=@base-ui_react_alert-dialog.js.map
