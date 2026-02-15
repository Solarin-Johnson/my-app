import { Platform } from "react-native";
import { Easing } from "react-native-reanimated";

export const SHARED_DATA = {
  text: "I've found the top 5 music apps that match your preferences best.",
  apps: [
    {
      name: "Spotify",
      logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
      description:
        "Listen to millions of songs and podcasts with tailored recommendations and custom playlists for a personalized music experience.",
      platforms: ["iOS", "Android"],
    },
    {
      name: "Apple Music",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/120px-Apple_Music_icon.svg.png",
      description:
        "Access over 100 million songs with spatial audio, lossless quality, and exclusive releases from your favorite artists worldwide.",
      platforms: ["iOS", "Android", "Web"],
    },
    {
      name: "YouTube Music",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/120px-Youtube_Music_icon.svg.png",
      description:
        "Discover music videos, live performances, official tracks, and remixes from your favorite artists all in one streaming platform.",
      platforms: ["iOS", "Android", "Web"],
    },
    {
      name: "Tidal",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtk-KVZgKJ30k8DDSqdxmMGDy6z11515g-oA&s",
      description:
        "Experience high-fidelity sound quality with lossless audio, exclusive content, and direct artist support through this premium streaming service.",
      platforms: ["iOS", "Android"],
    },
    {
      name: "SoundCloud",
      logo: "https://icon-icons.com/download-file?file=https%3A%2F%2Fimages.icon-icons.com%2F2972%2FPNG%2F512%2Fsoundcloud_logo_icon_186893.png&id=186893&pack_or_individual=pack",
      description:
        "Explore indie tracks, emerging artists, remixes, and underground music from around the world in this creator-focused platform.",
      platforms: ["iOS", "Android", "Web"],
    },
  ],
};

export const TIMING_CONFIG = {
  duration: 300,
  easing: Easing.inOut(Easing.ease),
};

export const SPRING_CONFIG = {
  damping: 30,
  mass: 0.45,
  stiffness: 150,
  overshootClamping: true,
};

export const isAndroid = Platform.OS === "android";
