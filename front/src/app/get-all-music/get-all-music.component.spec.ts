import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllMusicComponent } from './get-all-music.component';

describe('GetAllMusicComponent', () => {
  let component: GetAllMusicComponent;
  let fixture: ComponentFixture<GetAllMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllMusicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
