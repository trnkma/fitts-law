import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CircleData, CircleComponent } from './circle/circle.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CircleComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  circles: CircleData[] = [];
  bigCircles: CircleData[] = [];
  smallCircles: CircleData[] = [];
  private smallSize;
  private bigSize;
  private idCounter = 0;
  private startTime: number;
  private lastTime: number;
  private endTime: number;
  startedGame = false;
  hasFinishedBigCircles = false;
  hasFinishedSmallCircles = false;
  isPlaying = true;
  finishedGame = false;
  result = {
    bigCirclesAVGTime: 0,
    smallCirclesAVGTime: 0
  }


  startGame() {
    if (window.innerWidth > window.innerHeight) {
      this.smallSize = (window.innerHeight / 7) as number;
      this.bigSize = (window.innerHeight / 2) as number;
    } else {
      this.smallSize = (window.innerWidth / 7) as number;
      this.bigSize = (window.innerWidth / 2) as number;
    }
    this.startedGame = true;
    this.circles = this.createCircles(10, this.bigSize, window.innerHeight * 0.2);
    this.circles[0].visible = true;

  }

  private startSmallCircles() {
    this.bigCircles = [...this.circles];
    this.isPlaying = true;
    this.idCounter = 0;
    this.circles = this.createCircles(10, this.smallSize);
    this.circles[0].visible = true;
  }

  private createCircles(count: number, size: number, marginTop: number = 0, marginBot: number = 0): CircleData[] {
    const circles: CircleData[] = [];

    for (let i = 0; i < count; i++) {
      let position
      // if(bigCircles) position = bigCircles[i].position;
      position = this.getRandomPosition(size, circles, marginTop, marginBot);

      circles.push({
        id: this.idCounter++,
        size,
        position,
        color: '#00a200',
        gotClicked: false,
        timeClicked: null,
        visible: false
      });
    }
    console.log(circles)
    return circles;
  }

  private getRandomPosition(size: number, existingCircles: CircleData[], marginTop, marginBot): { top: string; left: string; } {
    const padding = 5;
    let position;
    let isValidPosition = false;
    // while (!isValidPosition) {
    const top = Math.random() * (window.innerHeight - marginTop - size - marginBot) + marginTop;
    const left = Math.random() * (window.innerWidth - size);
    position = { top: `${top}px`, left: `${left}px` };

    // isValidPosition = !existingCircles.some(circle => this.isOverlapping({ top, left, size }, circle));
    // }
    return position;
  }

  // private isOverlapping(newCircle: { top: number; left: number; size: number }, existingCircle: CircleData): boolean {
  //   const existingTop = parseFloat(existingCircle.position.top);
  //   const existingLeft = parseFloat(existingCircle.position.left);
  //   const existingSize = existingCircle.size;

  //   const distance = Math.sqrt(
  //     Math.pow(newCircle.left + newCircle.size / 2 - (existingLeft + existingSize / 2), 2) +
  //     Math.pow(newCircle.top + newCircle.size / 2 - (existingTop + existingSize / 2), 2)
  //   );

  //   return distance < (newCircle.size + existingSize) / 2;
  // }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  removeCircle(id: number) {
    this.circles = this.circles.filter(circle => circle.id !== id);
  }

  circleClicked(id: number) {
    if (!this.isNextCircle(id)) return;
    let clickedCircle = this.circles.find(circle => circle.id === id)
    let time = Date.now()
    if (id !== 0) { //first circle
      clickedCircle.timeClicked = time - this.lastTime;
    }
    this.lastTime = time;
    clickedCircle.gotClicked = true;

    if (id === this.circles.length - 1) {
      this.endTime = Date.now();
      this.hasFinishedBigCircles ? this.hasFinishedSmallCircles = true : this.hasFinishedBigCircles = true;
      this.isPlaying = false;
      if (this.hasFinishedSmallCircles) this.createResult();
    } else {
      this.circles[id + 1].visible = true;
    }
  }


  private isNextCircle(id: number): boolean {
    if (id === 0) return true;
    else return this.circles.find(circle => circle.id === id - 1).gotClicked;
  }

  playSmallCircles() {
    this.startSmallCircles();
  }

  createResult() {
    let bigCircleAVGTime = 0;
    this.bigCircles.forEach(circle => bigCircleAVGTime += circle.timeClicked);
    console.log(bigCircleAVGTime)
    bigCircleAVGTime = bigCircleAVGTime / this.bigCircles.length - 1;
    console.log(bigCircleAVGTime)
    this.result.bigCirclesAVGTime = bigCircleAVGTime;
    let smallCirclesAVGTime = 0;
    this.circles.forEach(circle => smallCirclesAVGTime += circle.timeClicked);
    smallCirclesAVGTime = smallCirclesAVGTime / this.circles.length - 1;
    this.result.smallCirclesAVGTime = smallCirclesAVGTime;
    this.finishedGame = true;
  }
}
