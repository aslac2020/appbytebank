import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes} from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { merge } from 'rxjs';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  todaAcoes$ = this.acoesService.getAcoes();

  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITACAO),
    tap(() => {
      console.log('Fluxo do Filtro');
    }),
    tap(console.log),
    filter((valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado))
    );

  acoes$ = merge(this.todaAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) {}

}
