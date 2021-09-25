<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";
  import { loop } from "svelte/internal";
  import type { CarouselContext } from "./context";
  import { key } from "./context";
  import { getTarget, getTrajectory } from "./trajectory";
  import { lateMountWarning } from "./warnings";

  export let position: number = 0;
  let count: number = 0;
  let previousAvailable = false;
  let nextAvailable = false;

  interface SlotExposedProps {
    position: number;
    count: number;
    previous: () => void;
    next: () => void;
    previousAvailable: boolean;
    nextAvailable: boolean;
    goTo: (key: number) => void;
  }

  interface $$Slots {
    "inner-controls": SlotExposedProps;
    "outer-controls": SlotExposedProps;
  }

  function updatePositionControlAvailability() {
    previousAvailable = position !== 0;
    nextAvailable = position !== count - 1;
  }

  const itemElements: (HTMLDivElement | null)[] = [];
  let hasMounted = false;
  let context: CarouselContext = {
    register(): number {
      itemElements.push(null);
      let id = count++;
      updatePositionControlAvailability();
      return id;
    },
    provideDOMElement(index: number, el: HTMLDivElement) {
      if (hasMounted) {
        lateMountWarning();
      }
      itemElements[index] = el;
    },
    destroy(index: number) {
      itemElements[index] = null;
    },
  };
  if (getContext(key) !== undefined) {
    throw new Error("<Carousel> cannot be used inside another <Carousel>");
  }
  setContext(key, context);

  onMount(() => {
    hasMounted = true;
    console.log("Carousel mounted!");

    if (count > 1) {
      nextAvailable = true;
    }
  });

  function previous() {
    if (previousAvailable) {
      goTo(position - 1);
    }
  }
  function next() {
    if (nextAvailable) {
      goTo(position + 1);
    }
  }
  function goTo(index: number) {
    innerRelease?.(index);
  }

  const targetDamping = 8;
  function getNearest(position: number, velocity: number) {
    // 1. get intended landing position
    let targetPos = getTarget(position, velocity, targetDamping);

    // 2. get closest element
    let closestTarget = 0;
    let closestTargetDistance = Infinity;
    let closestIdx = 0;
    itemElements.forEach((element, i) => {
      if (element) {
        let x = element.offsetLeft;
        let d = Math.abs(x - targetPos);
        if (d < closestTargetDistance) {
          closestTargetDistance = d;
          closestTarget = x;
          closestIdx = i;
        }
      }
    });
    return { target: closestTarget, index: closestIdx };
  }

  let innerRelease: ((target: number) => void) | null = null;
  const scrollTime = 400;

  function scrollEffect(node: HTMLDivElement) {
    let loopAborter: (() => void) | null = null;
    let velocity = 0;
    let startTime = 0;

    let pixelPosition: number;

    function grab() {
      loopAborter?.();
    }

    function release(targetIdx?: number) {
      loopAborter?.();
      pixelPosition = node.scrollLeft;
      let target: number = 0;
      if (targetIdx === undefined) {
        let nearest = getNearest(pixelPosition, velocity);
        target = nearest.target;
        position = nearest.index;
      } else {
        position = targetIdx;
        target = itemElements[targetIdx]?.offsetLeft ?? 0;
        velocity = 0;
      }
      updatePositionControlAvailability();
      startTime = performance.now();
      const trajectory = getTrajectory(pixelPosition, target, velocity);
      loopAborter = loop((now: number) => {
        let t = (now - startTime) / scrollTime;
        if (t >= 1) {
          node.scrollLeft = target;
          loopAborter = null;
          return false;
        }

        pixelPosition = trajectory(t);
        console.log("moving to", pixelPosition);
        node.scrollLeft = pixelPosition;
        return true;
      }).abort;
    }
    innerRelease = release;

    let lastX: number;
    let lastTime: number;
    function touchStart(evt: TouchEvent) {
      // let's just not even attempt multiple touches
      if (evt.touches.length !== 1) return;

      grab();
      lastX = evt.touches[0].pageX;
      lastTime = evt.timeStamp;
      evt.preventDefault();
    }

    function touchMove(evt: TouchEvent) {
      // let's just not even attempt multiple touches
      if (evt.touches.length !== 1) return;

      let x = evt.touches[0].pageX;
      let time = evt.timeStamp;
      let dx = lastX - x;
      let dTime = time - lastTime;
      lastX = x;
      lastTime = time;
      console.log(dx);
      console.log(node.scrollLeft);
      node.scrollLeft += dx;
      velocity = (dx * scrollTime) / (dTime || 1 / 60);
      evt.preventDefault();
    }

    function touchEnd(evt: TouchEvent) {
      if (evt.touches.length === 0) release();
    }

    let wheelScrollEndHandle = -1;
    function wheel(_evt: Event) {
      const evt = _evt as WheelEvent;
      let time = evt.timeStamp;
      let dTime = time - lastTime;
      lastTime = time;

      let dy = evt.deltaY;
      let dx = evt.deltaX;

      if (evt.shiftKey && Math.abs(dy) > Math.abs(dx)) {
        dx = dy;
        node.scrollLeft += dx;
        evt.preventDefault();
      }

      velocity = (dx * scrollTime) / (dTime || 1 / 60);

      grab();
      clearTimeout(wheelScrollEndHandle);
      wheelScrollEndHandle = setTimeout(release, 67);
    }

    node.addEventListener("touchstart", touchStart);
    node.addEventListener("touchmove", touchMove);
    node.addEventListener("touchend", touchEnd);

    node.addEventListener("wheel", wheel);

    return {
      destroy() {},
    };
  }
</script>

<div class="carousel-container" use:scrollEffect>
  <slot />
  <slot
    {previous}
    {next}
    {previousAvailable}
    {nextAvailable}
    {goTo}
    {position}
    {count}
    name="inner-controls"
  />
</div>
<slot
  {previous}
  {next}
  {previousAvailable}
  {nextAvailable}
  {goTo}
  {position}
  {count}
  name="outer-controls"
/>

<style>
  .carousel-container {
    display: flex;
    overflow: auto;
  }
</style>
