import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import gsap from "gsap";
import { ExpoScaleEase, RoughEase, SlowMo } from "gsap/EasePack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader } from "@pixi/loaders";
gsap.registerPlugin(
  ScrollTrigger,
  // GSDevTools,
  ExpoScaleEase,
  RoughEase,
  SlowMo
);
import styles from "./App.module.css";
// import videojs from "video.js";
const map = (
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) => {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};
let container: HTMLDivElement;
let st: ScrollTrigger;
const loader = new Loader();

const App: Component = () => {
  let background;
  const [progress, setProgress] = createSignal(0);
  let imgRef: HTMLImageElement;
  for (let i = 1; i < 1805; i++) {
    let s = `/frame/f_${i.toString().padStart(4, "0")}.jpg`;
    loader.add(s);
  }
  loader.onProgress.add((e) => {
    setProgress(e.progress);
    console.log(e.progress);
    if (loader.resources["/frame/f_0001.jpg"]) {
      console.log("loaded");
      imgRef.src = loader.resources["/frame/f_0001.jpg"].data.src;
    }
  });

  loader.load();
  onMount(() => {
    st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `bottom bottom`,
      // scrub: true,
      // snap: {
      //   sanpTo: [0.055, 0.135, 0.16, 0.327, 0.393, 0.592, 0.69, 0.818, 0.923],
      //   duration: 0.5,
      // },
      scrub: 1,
      // snap: [0.055, 0.135, 0.16, 0.327, 0.393, 0.592, 0.69, 0.818, 0.923],
      onUpdate: (self) => {
        const currentFrame = `/frame/f_${Math.floor(
          map(self.progress, 0, 1, 1, 1804)
        )
          .toString()
          .padStart(4, "0")}.jpg`;
        let img = loader.resources[currentFrame].data;
        if (imgRef) {
          imgRef.src = img.src;
        }
        if (self.progress > 0.99) {
          window.scrollTo(0, 0);
        }
      },
    });
    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: background,
    //     start: "top top",
    //     end: "bottom center",
    //     scrub: true,
    //     pin: true,
    //     anticipatePin: 1,
    //     // markers: true,
    //     onUpdate: (self) => {
    //       // console.log(self.progress);
    //     },
    //   },
    // });
  });
  onCleanup(() => {
    st.kill();
  });

  return (
    <div class={styles.App} ref={container}>
      <div class={styles.background} ref={background}>
        <img src="" ref={imgRef!} alt="" />
      </div>
      <Show when={progress() < 50}>
        <div class={styles.loading}>Loading </div>
      </Show>
    </div>
  );
};

export default App;
