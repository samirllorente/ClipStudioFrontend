import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialConfig } from './social-config';

describe('SocialConfig', () => {
  let component: SocialConfig;
  let fixture: ComponentFixture<SocialConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
