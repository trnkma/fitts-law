import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CircleData {
  id: number;
  size: number;
  position: { top: string, left: string };
  color: string;
  gotClicked: boolean;
  timeClicked: number;
  visible: boolean;
}


@Component({
  selector: 'app-circle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle.component.html',
  styleUrl: './circle.component.scss'
})
export class CircleComponent {
  @Input() circleData: CircleData;
  @Output() onCircleClick = new EventEmitter<number>();

  get style() {
    return {
      width: `${this.circleData.size}px`,
      height: `${this.circleData.size}px`,
      top: this.circleData.position.top,
      left: this.circleData.position.left,
      backgroundColor: this.circleData.color
    };
  }
  onClick() {
    if(this.circleData.gotClicked) return;
    this.onCircleClick.emit(this.circleData.id)
  }
}
