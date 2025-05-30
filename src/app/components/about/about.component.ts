import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

interface CompanyValue {
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      description: 'Passionate about bringing people together through events.'
    },
    {
      name: 'Sarah Johnson',
      role: 'Event Director',
      description: 'Expert in event planning and customer experience.'
    },
    {
      name: 'Michael Chen',
      role: 'Technical Lead',
      description: 'Ensuring smooth and secure event booking experiences.'
    }
  ];

  companyValues: CompanyValue[] = [
    {
      title: 'Customer First',
      description: 'We prioritize our customers\' needs and satisfaction above all else.'
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology.'
    },
    {
      title: 'Community',
      description: 'Building strong connections through memorable events.'
    },
    {
      title: 'Reliability',
      description: 'Providing dependable and secure event booking services.'
    }
  ];
}
