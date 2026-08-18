import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFavoriteComponent } from './display-favorite.component';

describe('DisplayFavoriteComponent', () => {
  let component: DisplayFavoriteComponent;
  let fixture: ComponentFixture<DisplayFavoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayFavoriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
