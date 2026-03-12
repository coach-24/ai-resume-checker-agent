import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function AIParticles() {

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },

        particles: {
  number: {
    value: 50,
    density: {
      enable: true,
      area: 800
    }
  },

  color: {
    value: "#3b82f6"
  },

  links: {
    enable: true,
    distance: 130,
    color: "#60a5fa",
    opacity: 0.35,
    width: 1
  },

  move: {
    enable: true,
    speed: 1,
    outModes: {
      default: "bounce"
    }
  },

  opacity: {
    value: 0.5
  },

  size: {
    value: { min: 2, max: 4 }
  }
},

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
        },
      }}

      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}

export default AIParticles;