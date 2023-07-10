/* Tracing.ts */
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston'

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://apm.speakeasy.cards:4318/v1/traces',
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {}
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter()
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new WinstonInstrumentation({
      enabled: true,
      logHook: (_span, record) => {
        record['resource.service.name'] = 'speakeasy-backend'
      }
    })
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'speakeasy-backend'
  })
})

sdk
  .start()
