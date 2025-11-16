import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { DocksService } from './docks.service';

@Injectable({ providedIn: 'root' })
export class PortLayoutService {  
  constructor(
    private apiService: ApiService,
    private docksService: DocksService
  ) {}

  async getLayout(): Promise<{
    dockPositions: any[];
    warehousePositions: any[];
  }> {
    try {
      // 1️⃣ Buscar layout base (com placeholders)
      const layout = await firstValueFrom(
        this.apiService.get<any>('/PortLayout/Layout')
    );



      // 2️⃣ Buscar dados reais do backend
      const docks = await firstValueFrom(this.docksService.getAllDocks());
      // (Poderias também ter um WarehousesService para warehouses)

      // 3️⃣ Mapear docas apenas até ao limite de slots
      const dockPositions = layout.dockSlots
        .slice(0, docks.length)
        .map((slot: any, index: number) => ({
          ...slot,
          name: docks[index]?.name || `Dock ${index + 1}`
        }));

      // 4️⃣ Warehouses (exemplo vazio por agora)
      const warehousePositions = layout.warehouseSlots.slice(0, 0); // ainda sem dados reais

      console.log('Layout:', layout);
      console.log('Docks do backend:', docks);
      console.log('DockPositions finais:', dockPositions);


      return { dockPositions, warehousePositions };
    } catch (error) {
      console.error('❌ Erro a carregar layout:', error);
      return { dockPositions: [], warehousePositions: [] };
    }
  }
}
