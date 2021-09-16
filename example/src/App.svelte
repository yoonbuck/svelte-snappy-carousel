<script lang="ts">
  import { Carousel, CarouselItem } from "svelte-snappy-carousel";
</script>

<main>
  <Carousel>
    <CarouselItem>
      <div class="square" style="background: red" />
    </CarouselItem>
    <CarouselItem>
      <div class="square" style="background: orange" />
    </CarouselItem>
    <CarouselItem>
      <div class="square" style="background: yellow" />
    </CarouselItem>
    <CarouselItem>
      <div class="square" style="background: green" />
    </CarouselItem>
    <div
      slot="outer-controls"
      class="outer"
      let:position
      let:count
      let:previous
      let:previousAvailable
      let:next
      let:nextAvailable
    >
      <button on:click={previous} disabled={!previousAvailable}>&larr;</button>
      {position + 1} / {count}
      <button on:click={next} disabled={!nextAvailable}>&rarr;</button>
    </div>
  </Carousel>
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
  }
  .square {
    width: 100%;
    height: 100vh;
  }
  .outer {
    display: flex;
    gap: 1rem;
    align-items: center;
    background: white;
    position: fixed;
    left: 50%;
    bottom: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 8px -3px rgba(0, 0, 0, 0.5);
    transform: translate(-50%);
  }
  button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
</style>
