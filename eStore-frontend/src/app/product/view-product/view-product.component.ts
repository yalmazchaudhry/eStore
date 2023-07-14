import {
  Component,
  Input,
  Output,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements AfterViewInit {
  @Input() product: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  closeModal() {
    this.closeModalEvent.emit('view');
  }
  ngAfterViewInit(): void {
    document.getElementById('viewModalButton')?.click();
  }
}
