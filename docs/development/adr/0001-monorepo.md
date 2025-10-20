# ADR-0001: Monorepo Architecture Decision

## Status
Accepted

## Context
Verdantia is a plant identification and care application that requires both mobile and backend components. We need to decide on the overall architecture and technology stack.

## Decision
We will use a monorepo structure with the following technology choices:

### Technology Stack
- **Mobile App**: Expo React Native with TypeScript
- **Backend API**: FastAPI (Python 3.11) with proper package structure
- **Database**: SQLite for local development, PostgreSQL for production
- **CI/CD**: GitHub Actions
- **Containerization**: Docker Compose for local development

### Monorepo Structure
```
verdantia/
├── app/
│   ├── api/            # FastAPI service with package structure
│   ├── mobile/         # Expo React Native app
│   ├── ml/             # ML training and model export
│   └── infra/          # Docker, CI/CD, workflows
├── docs/               # Documentation and ADRs
└── assets/             # Design assets
```

## Rationale

### Why Monorepo?
- **Simplified Development**: Single repository for all components
- **Shared Dependencies**: Common tooling and configuration
- **Atomic Changes**: Cross-component changes in single commits
- **Easier CI/CD**: Single pipeline for all components

### Why Expo React Native?
- **Cross-Platform**: Single codebase for iOS and Android
- **Rapid Development**: Hot reloading and over-the-air updates
- **Rich Ecosystem**: Extensive library support
- **TypeScript Support**: Type safety and better developer experience

### Why FastAPI?
- **Performance**: High-performance async framework
- **Type Safety**: Built-in Pydantic validation
- **Auto Documentation**: Automatic OpenAPI/Swagger generation
- **Modern Python**: Async/await support and modern Python features

### Why SQLite Locally?
- **Simplicity**: No external database setup required
- **Development Speed**: Instant startup and no configuration
- **Portability**: Database file can be easily shared and versioned

### Why PostgreSQL for Production?
- **Scalability**: Better performance for production workloads
- **ACID Compliance**: Strong consistency guarantees
- **Ecosystem**: Rich tooling and monitoring support

## Consequences

### Positive
- Faster development with shared tooling
- Easier cross-component testing
- Simplified deployment pipeline
- Better code sharing between components

### Negative
- Larger repository size
- Potential for tight coupling between components
- More complex CI/CD pipeline setup

## Implementation Notes
- Use proper package structure in FastAPI (`verdantia_api/`)
- Implement comprehensive testing with pytest
- Use Docker Compose for local development
- Implement proper error handling and logging
- Use TypeScript strictly in mobile app
- Implement offline retry functionality with Zustand

## Related Decisions
- ADR-0002: API Design Patterns (pending)
- ADR-0003: Mobile App State Management (pending)
