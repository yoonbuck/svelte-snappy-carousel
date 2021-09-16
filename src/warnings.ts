let lateMountFirstWarning = true;

export function lateMountWarning() {
  if (lateMountFirstWarning) {
    lateMountFirstWarning = false;
    console.groupCollapsed(
      "Carousels don't support dynamically changing content.",
      "(Expand for more information and some possible causes)"
    );
    console.log(
      "If you're using an {#each} block inside a <Carousel>, you may need to",
      "specify a (key) so that carousel items are updated instead of recreated."
    );
    console.log("  See: https://svelte.dev/tutorial/keyed-each-blocks");
    console.log(
      "If you're loading carousel content asynchronously, either wrap the",
      "entire <Carousel> in your {#await} block, or place {#await} blocks",
      "inside of individual <CarouselItem> components."
    );
    console.groupEnd();
  }
  console.warn(
    "A new <CarouselItem> was added after this <Carousel> was already done mounting."
  );
}
