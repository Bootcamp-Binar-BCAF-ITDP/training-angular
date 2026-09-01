import { Component, signal } from '@angular/core';

interface Cabang {
  id: number;
  name: string;
}

@Component({
  selector: 'app-master-cabang',
  imports: [],
  templateUrl: './master-cabang.html',
})
export class MasterCabang {
  cabang$ = signal<Cabang[]>([]);

  constructor() {}

  addCabang() {
    const nextId = this.cabang$().length + 1;

    this.cabang$.update((currentList) => [
      ...currentList,
      { id: nextId, name: `Cabang ${nextId}` },
    ]);
  }
}
