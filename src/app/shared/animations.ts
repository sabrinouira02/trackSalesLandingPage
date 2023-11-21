import { trigger, state, style, animate, transition } from '@angular/animations';

export const fadeAndScale = trigger('fadeAndScale', [
  state('in', style({ opacity: 1, transform: 'scale(1)' })),
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }),
    animate('2000ms ease-out'),
  ]),
  transition(':leave', [
    animate('2000ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' })),
  ]),
])

export const slideInOut = trigger('slideInOut', [
  state('in', style({ transform: 'translateX(0)' })),
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('2000ms ease-in-out'),
  ]),
  transition(':leave', [
    animate('2000ms ease-in-out', style({ transform: 'translateX(100%)' })),
  ]),
]);

export const slideIn = trigger('slideIn', [
  state('in', style({ transform: 'translateX(0)' })),
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('600ms ease-in-out'),
  ]),
  transition(':leave', [
    animate('600ms ease-in-out', style({ transform: 'translateX(100%)' })),
  ]),
]);

export const fadeInOut = trigger('fadeInOut', [
  state('in', style({ opacity: 1 })),
  transition(':enter', [style({ opacity: 0 }), animate(2000)]),
  transition(':leave', animate(2000, style({ opacity: 0 }))),
]);
