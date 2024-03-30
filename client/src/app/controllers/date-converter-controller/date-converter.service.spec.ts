import { TestBed } from '@angular/core/testing';

import { DateConverterService } from './date-converter.service';

describe('DateConverterService', () => {
  let service: DateConverterService;

  beforeEach(() => {
    service = new DateConverterService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('convertDate should return a string representation', () => {
    let date = new Date(2000, 0, 1, 12, 34, 56);
    
    expect(service.convertDate(date)).toBe('1/1/2000 12:34:56 PM');
  });

  it('convertShortDate should return a string representation', () => {
    let date = new Date(2000, 0, 1, 12, 34, 56);
    
    expect(service.convertShortDate(date)).toBe('1/1/2000');
  });
});
