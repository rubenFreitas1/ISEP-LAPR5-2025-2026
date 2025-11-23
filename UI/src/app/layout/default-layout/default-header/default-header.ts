import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  SidebarToggleDirective,
  HeaderModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-default-header',
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, RouterLink,  NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownDividerDirective, HeaderModule,TranslateModule],
  templateUrl: './default-header.html',
  styleUrl: './default-header.css',
})
export class DefaultHeader extends HeaderComponent implements OnInit {
  readonly translate = inject(TranslateService);
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly auth0 = inject(AuthService);

  userName = 'User';

  readonly colorModes = [
    { name: 'light', text: 'SETTINGS.LIGHT', icon: 'cilSun' },
    { name: 'dark', text: 'SETTINGS.DARK', icon: 'cilMoon' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  // reactive language signal so UI updates when language changes
  readonly language = signal(localStorage.getItem('lang') || (navigator?.language ?? 'en').startsWith('pt') ? 'pt' : 'en');

  readonly currentLanguage = computed(() => this.language());

  readonly currentLanguageLabel = computed(() => (this.currentLanguage() === 'pt' ? 'PT' : 'EN'));

  constructor() {
    super();

    const initial = localStorage.getItem('lang') || this.currentLanguage();
    this.language.set(initial);
    this.translate.setDefaultLang(initial);
    this.translate.use(initial);
  }

  sidebarId = input('sidebar1');

  async ngOnInit() {
    this.userName = await this.auth0.getUserName();
    document.documentElement.lang = this.currentLanguage();
  }

  logout() {
    this.auth0.logout();
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.language.set(lang);
    this.translate.use(lang);

    document.documentElement.lang = lang;
  }


}
