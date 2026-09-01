import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../core/layout/navbar/navbar.component';

interface Feature {
  id: number
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './landing-page.html',
})
export class LandingPageComponent {
  features: Feature[] = [
    {
      id:1,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance to keep your users engaged.',
    },
    {
      id:2,
      title: 'Fully Responsive',
      description: 'Looks stunning on mobile devices, tablets, and large desktop screens.',
    },
    {
      id:3,
      title: 'Secure & Reliable',
      description: 'Built with modern best practices to ensure top-tier security.',
    }
  ];

  onGetStarted() {
    alert('Thank you for getting started!');
  }
}
