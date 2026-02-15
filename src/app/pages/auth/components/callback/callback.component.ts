
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-callback',
    standalone: true,
    template: `<p>Processing login...</p>`
})
export class CallbackComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router);
    authService = inject(AuthService);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            if (token) {
                this.authService.handleCallback(token);
            } else {
                this.router.navigate(['/auth/login']);
            }
        });
    }
}
