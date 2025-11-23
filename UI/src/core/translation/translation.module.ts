import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';

export class JsonLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const promise = fetch(`/assets/i18n/${lang}.json`).then(res => res.json());
    return from(promise);
  }
}

@NgModule({
  exports: [TranslateModule],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: JsonLoader
      }
    })
  ]
})
export class TranslationModule {}
