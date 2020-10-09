import {
    Directive,
    ElementRef,
    EventEmitter,
    OnDestroy,
    Output,
    Input
} from "@angular/core";
import {
    fromEvent,
    merge,
    of,
    Subscription,
    timer
} from "rxjs";
import {
    filter,
    map,
    switchMap
} from "rxjs/operators";

@Directive({
    selector: "[longPress]"
})
export class LongPressDirective implements OnDestroy {
    private eventSubscribe: Subscription;
    threshold = 500;

    @Output()
    mouseLongPress = new EventEmitter();
    @Input() disabled;

    constructor(private elementRef: ElementRef) {
        const mousedown = fromEvent<MouseEvent>(elementRef.nativeElement, "mousedown").pipe(
            filter(event =>  event.button == 0),  // Only allow left button (Primary button)
            map((event) => true) // turn on threshold counter
        );
        const mouseup = fromEvent<MouseEvent>(elementRef.nativeElement, "mouseup").pipe(
            filter(event => event.button == 0),  // Only allow left button (Primary button)
            map(() => false )
        );
        this.eventSubscribe = merge(mousedown, mouseup)
            .pipe(
                switchMap(state =>
                    state ? timer(this.threshold, 100) : of(null)
                ),
                filter(value => value && !this.disabled)
            )
            .subscribe(() => this.mouseLongPress.emit());
    }

    ngOnDestroy(): void {
        if (this.eventSubscribe) {
            this.eventSubscribe.unsubscribe();
        }
    }
}