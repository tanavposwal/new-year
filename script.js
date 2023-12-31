const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

canvas.width = screenWidth;
canvas.height = screenHeight;
const three = document.getElementById("three")
const four = document.getElementById("four")
const ccountdown = document.getElementById("ccountdown")
const btn = document.getElementById("btn")
const sound = new Audio('new-year-countdown.mp3');


class Rocket {
    constructor() {
        this.radius = (Math.random() * 4) + 4;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.speed = 3;
        this.explosionRadius = (Math.random() * 30)  + 30;
        this.explosionIncrement = 2;
        this.explosionMaxRadius = (Math.random() * (canvas.height/2)) + (canvas.height/4);
        this.strokeAlpha = 1.0;
        this.strokeDecayRate = 0.01;
        this.isExploded = false;
        this.explosionStart = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    explode() {
        if (this.explosionRadius <= this.explosionMaxRadius) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.strokeAlpha})`;
            ctx.stroke();
            ctx.closePath();

            this.explosionRadius += this.explosionIncrement;
            this.strokeAlpha -= this.strokeDecayRate;
        } else {
            this.isExploded = true;
        }
    }

    update() {
        if (!this.explosionStart) {
            this.y -= this.speed;
            this.draw();
        }

        if (this.y < canvas.height / 2) {
            this.explode();
            this.explosionStart = true;
        }
    }
}

const rockets = [];

function startCountdown() {
    const countdownElement = document.getElementById('countdown');

    let count = 10;
    countdownElement.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        countdownElement.textContent = count;

        if (count === 0) {
            clearInterval(countdownInterval);
            four.hidden = false
            ccountdown.hidden = true
            fireworks()
        }
    }, 1000);

}

function handle() {
    three.hidden = true
    ccountdown.hidden = false
    btn.hidden = true
    sound.play();
    startCountdown();
}

function fireworks() {

    canvas.style.display = "block";

    const particles = [];
    const particleCount = 100;

    function createParticle() {

        return {
            x: Math.random() * screenWidth,
            y: (Math.random() * 50) * (-1),
            size: Math.random() * 4 + 1,
            speedY: Math.random() * 2 + 5,
            shape: "circle",
            color: `hsl(${Math.random() * 360}, 100%, 70%)`
        };
    }

    function draw() {
        requestAnimationFrame(draw);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, screenWidth, screenHeight);

        for (let i = 0; i < particleCount; i++) {
            particles[i].y += particles[i].speedY;

            ctx.beginPath();
            ctx.fillStyle = particles[i].color;

            if (particles[i].shape === 'circle') {
                ctx.arc(particles[i].x, particles[i].y, particles[i].size, 0, Math.PI * 2);
            } else if (particles[i].shape === 'string') {
                ctx.fillRect(particles[i].x - particles[i].size / 2, particles[i].y, particles[i].size, 3);
            } else if (particles[i].shape === 'square') {
                ctx.fillRect(particles[i].x - particles[i].size / 2, particles[i].y - particles[i].size / 2, particles[i].size, particles[i].size);
            }
            ctx.fill();

            // Reset particle when it reaches the bottom
            if (particles[i].y - particles[i].size > screenHeight) {
                particles[i].y = -20;
                particles[i].x = Math.random() * screenWidth;
            }
        }

        for (let i = 0; i < rockets.length; i++) {
            rockets[i].update();

            // Remove rockets that have exploded or moved off the screen
            if (rockets[i].isExploded || rockets[i].y + rockets[i].radius < 0) {
                rockets.splice(i, 1);
            }
        }

        if (Math.random() < 0.01) {
            rockets.push(new Rocket());
        }

    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }

    

    draw();
}
