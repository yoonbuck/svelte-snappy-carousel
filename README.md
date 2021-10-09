# svelte-snappy-carousel

Touch-friendly snappy horizontal carousel for svelte.

[Demo](https://svelte-snappy-carousel.dev.yoonbuck.com/)

## Usage

```svelte
<script lang="ts">
  import { Carousel, CarouselItem } from "svelte-snappy-carousel";
</script>

<Carousel>
  <!-- CarouselItems represent carousel panes -->
  <CarouselItem>
    <h1>Pane 1</h1>
    <p>...</p>
  </CarouselItem>
  <CarouselItem>
    <h1>Pane 2</h1>
    <p>...</p>
  </CarouselItem>
  <CarouselItem>
    <h1>Pane 3</h1>
    <p>...</p>
  </CarouselItem>
</Carousel>
```

## Adding controls

Use `slot="inner-controls"` or `slot="outer-controls"` to add controls to the carousel.

`inner-controls` will be placed inside the carousel container; `outer-controls` will be after.

```svelte
<Carousel>
  <!-- ... -->
  <div
    slot="inner-controls"
    class="controls"
    let:position
    let:count
    let:previous
    let:previousAvailable
    let:next
    let:nextAvailable
  >
    <button on:click={previous} disabled={!previousAvailable}>←</button>
    {position + 1} / {count}
    <button on:click={next} disabled={!nextAvailable}>→</button>
  </div>
</Carousel>

<style>
  .controls {
    /* e.g., position absolutely inside carousel container */
  }
</style>
```

# Limitations

These are some
things to watch out for. Note that these limitations might change in the future.

- **No nested Carousels**

  You can't place a `<Carousel>` inside another `<Carousel>`

- **No dynamic content**

  You shouldn't add or remove `<CarouselItem>`s after the parent `<Carousel>` is mounted.

  It's okay to use an `{#each}` block if you know the backing array won't change. The contents of the array can change, as long as the `(key)`s stay the same, and the array doesn't grow or shrink.

  If you're loading content asynchronously, you should either wrap the entire `<Carousel>` in your `{#await}` block, or place `{#await}` blocks inside of individual `<CarouselItem>` components.
