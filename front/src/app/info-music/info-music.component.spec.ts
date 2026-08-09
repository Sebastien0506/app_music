import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMusicComponent } from './info-music.component';

describe('InfoMusicComponent', () => {
  let component: InfoMusicComponent;
  let fixture: ComponentFixture<InfoMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoMusicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
