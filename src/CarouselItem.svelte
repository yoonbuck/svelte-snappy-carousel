<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { CarouselContext, key } from "./context";

  const context = getContext<CarouselContext | undefined>(key);
  if (!context) {
    throw new Error("<CarouselItem> can only be used inside <Carousel>.");
  }

  let thisElement: HTMLDivElement;
  const myIndex = context.register();

  onMount(() => {
    context.provideDOMElement(myIndex, thisElement);
  });
</script>

<div class="item-container" bind:this={thisElement}>
  <slot />
</div>

<style>
  .item-container {
    flex: 0 0 100%;
    width: 100%;
  }
</style>
