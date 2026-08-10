import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicCategoryComponent } from './music-category.component';

describe('MusicCategoryComponent', () => {
  let component: MusicCategoryComponent;
  let fixture: ComponentFixture<MusicCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
