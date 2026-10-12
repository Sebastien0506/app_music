import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDescriptionAndLinkComponent } from './update-description-and-link.component';

describe('UpdateDescriptionAndLinkComponent', () => {
  let component: UpdateDescriptionAndLinkComponent;
  let fixture: ComponentFixture<UpdateDescriptionAndLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDescriptionAndLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDescriptionAndLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
