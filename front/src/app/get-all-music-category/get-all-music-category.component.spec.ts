import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllMusicCategoryComponent } from './get-all-music-category.component';

describe('GetAllMusicCategoryComponent', () => {
  let component: GetAllMusicCategoryComponent;
  let fixture: ComponentFixture<GetAllMusicCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllMusicCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllMusicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
