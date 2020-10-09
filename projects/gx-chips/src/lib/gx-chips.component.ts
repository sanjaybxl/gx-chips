import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import isEqual from "lodash.isequal";
import { MatMenuTrigger } from '@angular/material/menu';

export interface SelectedItemInterface {
  item: any;
  index: number;
  first: boolean;
}

@Component({
  selector: "[gx-chips]",
  styleUrls: ["./gx-chips.component.scss"],
  templateUrl: "./gx-chips.component.html"
})
/*
 *
 * @param() startAt - index of slide to render first. Default to 0.
 * @param() items - List of items to belong in carousel
 * @param() width - Size of window(view) to show
 * @param() $prev - Template for previous button
 * @param() $next - Template for next button
 * @param() $item - Template for the item
 */
export class GxChipsComponent implements AfterViewInit {
  childIndex: number = 0;
  amount: number = 0;
  startPress: number = 0;
  lastX: number = 0;

  @Input()
  startAt = 0;

  @Input()
  items: Array<any> = [];

  @Input()
  width: number = 200;

  @Input()
  $prev: TemplateRef<any>;

  @Input()
  $next: TemplateRef<any>;

  @Input()
  $item: TemplateRef<any>;

  @Output()
  onSelectedItem: EventEmitter<SelectedItemInterface> = new EventEmitter();

  @ViewChild("list", { static: true })
  list: ElementRef;

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onMousedown(e: MouseEvent) {
    if (e.which === 1) {
      this.startPress = e.clientX;
      this.lastX = this.amount;
    }
  }

  onMousemove(e: MouseEvent, maxWidth: number) {
    if (e.which === 1) {
      const amount = this.lastX - (this.startPress - e.clientX);
      if (amount > 0 || amount < -(maxWidth - this.width)) return;
      this.amount = amount;
    }
  }

  onMouseup(e: MouseEvent, elem: any) {
    if (e.which === 1) {
      this.startPress = 0;
      this.snap(elem);
    }
  }

  onLongPressing(forward: boolean, elem: any) {
    if (forward && this.amount <= -(this.list.nativeElement.scrollWidth - this.width))
      return;
    if (!forward && this.amount >= 0)
      return;
    console.log('scroll');

    this.scroll(forward, elem)
  }

  snap(elem: any) {
    let counter = 0;
    let lastVal = 0;
    for (let i = 0; i < this.items.length; i++) {
      const el = elem.children[i];
      const style = el.currentStyle || window.getComputedStyle(el);
      counter +=
        el.offsetWidth +
        (parseFloat(style.marginLeft) + parseFloat(style.marginRight));
      if (this.amount <= lastVal && this.amount >= -counter) {
        this.amount = -lastVal;
        this.childIndex = i;
        this.onSelectedItem.emit({
          item: this.items[this.childIndex],
          index: this.childIndex,
          first: false
        });
        return;
      }
      lastVal = counter;
    }
    return counter;
  }

  private scroll(forward: boolean, elem: any, qty = 1) {
    this.childIndex += forward ? qty : -qty;
    this.onSelectedItem.emit({
      item: this.items[this.childIndex],
      index: this.childIndex,
      first: false
    });
    this.amount = -this.calcScroll(elem);
  }

  private calcScroll(elem: any) {
    let counter = 0;
    for (let i = this.childIndex - 1; i >= 0; i--) {
      const el = elem.children[i];
      if (el) {
        const style = el.currentStyle || window.getComputedStyle(el);
        counter +=
          el.offsetWidth +
          (parseFloat(style.marginLeft) + parseFloat(style.marginRight));
      }
    }
    return counter;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.items &&
      !isEqual(changes.items.previousValue, changes.items.currentValue)
    ) {
      if (changes.items.firstChange) {
        this.onSelectedItem.emit({
          item: this.items[this.childIndex],
          index: this.childIndex,
          first: true
        });
      }
      this.amount = 0;
    }
  }

  ngAfterViewInit() {
    this.startPress = 1;
    this.scroll(true, this.list.nativeElement, this.startAt);
    setTimeout(() => (this.startPress = 0));
  }

  onLeftContextMenu(event: MouseEvent, forward: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': { 'start': true } };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onRightContextMenu(event: MouseEvent, forward: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': { 'start': false } };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  moveToBegin() {
    this.amount = 0;
  }

  moveToEnd() {
    this.amount = -(this.list.nativeElement.scrollWidth - this.width);
  }

  clear() {
    this.items = [];
  }
}
