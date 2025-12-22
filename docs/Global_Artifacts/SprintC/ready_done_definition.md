# Sprint C
## Definition of Ready 

Uma *User Story* só pode ser considerada **Ready** para o Sprint C quando **todos** os critérios abaixo forem cumpridos.

---

### 1. Clareza e Alinhamento Funcional

- [ ] Todos os membros da equipa envolvidos compreendem claramente:
  - O objetivo da *User Story*
  - O seu papel no contexto do Projeto
  - A sua relação com módulos existentes (ex.: OEM, Scheduling, SPA, 3D, IAM).

---

### 2. Definição Técnica e Arquitetural

- [ ] A *User Story* identifica claramente:
  - O(s) módulo(s) afetado(s) (ex.: OEM, Scheduling, SPA, 3D, SysAdmin).
  - Se envolve criação, leitura, atualização ou persistência de dados.
- [ ] As dependências entre módulos estão identificadas (ex.: consumo de APIs externas, impacto em VVNs, recursos, staff).
- [ ] Está definido se a funcionalidade:
  - Consome APIs existentes
  - Requer novos endpoints
  - Introduz alterações ao modelo de dados.
- [ ] Requisitos de autenticação, autorização (RBAC/ABAC) e auditoria estão identificados, quando aplicável.

---

### 3. Critérios de Aceitação

- [ ] Critérios de aceitação estão definidos de forma clara, objetiva e testável.
- [ ] Os critérios cobrem:
  - Casos normais
  - Casos de erro

---

### 4. Planeamento e Estimativa

- [ ] O tamanho da *User Story* é compatível com a sua conclusão dentro de um único sprint.
- [ ] A *User Story* está dividida em subtarefas técnicas claras.

---

### 5. UX, Visualização e Artefactos

- [ ] Existem artefactos de suporte quando relevantes:
  - Mockups
  - Diagramas
  - Fluxos de interação
- [ ] Para funcionalidades SPA ou 3D:
  - Está definido como o utilizador interage com a funcionalidade
  - Está identificado o feedback visual esperado (mensagens, estados, overlays, animações).

---

### 6. Responsabilidade

- [ ] A *User Story* está atribuída a um responsável principal.
- [ ] Está claro quem faz:
  - Desenvolvimento
  - Validação funcional.

---

## Definition of Done

Uma *User Story* só é considerada **Done** quando **todos** os critérios abaixo forem cumpridos.

---

### 1. Implementação Funcional

- [ ] Todo o código necessário foi implementado de acordo com os critérios de aceitação.
- [ ] A funcionalidade está integrada com os restantes módulos do sistema.
- [ ] Para módulos backend:
  - APIs REST estão funcionais e documentadas (Swagger/OpenAPI).
  - Comunicação inter-módulos ocorre exclusivamente via REST.
- [ ] Para funcionalidades que exigem persistência:
  - Os dados são corretamente armazenados
  - O histórico e o estado são preservados.

---

### 2. Segurança, Autorização e Auditoria

- [ ] Autenticação via IAM está corretamente integrada.
- [ ] As regras de autorização (RBAC/ABAC) são aplicadas corretamente.
- [ ] Acesso não autorizado é corretamente bloqueado e registado.
- [ ] Todas as operações relevantes são auditadas (timestamp, utilizador, ação).

---

### 3. Qualidade e Testes

- [ ] Todos os testes unitários foram implementados e executados com sucesso.
- [ ] Testes de integração foram executados, cobrindo:
  - Comunicação entre módulos
  - Persistência de dados
  - Casos de erro relevantes.
- [ ] Não existem bugs conhecidos identificados por testes ou revisão de código.

---

### 4. Front-end e Experiência do Utilizador

- [ ] A interface gráfica está funcional e alinhada com o design da aplicação.
- [ ] O utilizador recebe feedback claro para:
  - Sucessos
  - Erros
- [ ] Para funcionalidades 3D:
  - A interação é fluida
  - A informação apresentada está sincronizada com os dados do backend.

---

### 5. Integração e Deploy

- [ ] A funcionalidade foi integrada no ramo principal do projeto.
- [ ] O código foi corretamente versionado no repositório.
- [ ] A *User Story* foi deployada no ambiente correspondente (staging ou equivalente).
- [ ] Scripts automáticos (quando aplicável) foram testados com sucesso.

---

### 6. Documentação

- [ ] Toda a documentação necessária foi escrita:
  - Técnica (APIs, scripts, arquitetura)
  - Funcional (quando aplicável)
- [ ] Alterações relevantes foram refletidas na documentação existente.

---

### 7. Validação

- [ ] Todas as sugestões relevantes da revisão foram resolvidas.
- [ ] A *User Story* foi validada face aos critérios de aceitação.
- [ ] A equipa concorda que a *User Story* está pronta para demonstração e avaliação.

---

📌 **Nota Final**  
No Sprint C, uma *User Story* só é considerada **Done** se estiver **funcional, integrada, segura e operacional**, refletindo um sistema próximo de um ambiente real de produção.
