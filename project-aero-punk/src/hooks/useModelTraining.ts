import { useState, useCallback, useRef } from "react"
import * as tf from "@tensorflow/tfjs"
import { ModelTrainer } from "../ml/modelTraining"
import { DataPreprocessor } from "../ml/dataPreprocessing"

export interface TrainingConfig {
  epochs: number
  batchSize: number
  learningRate: number
}

export interface ModelMetrics {
  loss: number
  accuracy: number
  val_loss?: number
  val_accuracy?: number
}

export function useModelTraining() {
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [metrics, setMetrics] = useState<ModelMetrics[]>([])
  const [error, setError] = useState<string | null>(null)

  const trainerRef = useRef<ModelTrainer | null>(null)

  const trainModel = useCallback(async (images: string[], labels: number[][], config: TrainingConfig) => {
    try {
      setIsTraining(true)
      setError(null)
      setProgress(0)

      // Create a new model (you might want to define your model architecture here)
      const model = tf.sequential({
        layers: [
          tf.layers.conv2d({ inputShape: [224, 224, 3], filters: 32, kernelSize: 3, activation: "relu" }),
          tf.layers.maxPooling2d({ poolSize: [2, 2] }),
          tf.layers.flatten(),
          tf.layers.dense({ units: 64, activation: "relu" }),
          tf.layers.dense({ units: labels[0].length, activation: "softmax" }),
        ],
      })

      trainerRef.current = new ModelTrainer(model)

      // Preprocess images
      const tensors = await Promise.all(
        images.map((img) => tf.browser.fromPixels(img).resizeBilinear([224, 224]).toFloat().div(tf.scalar(255))),
      )

      const xs = tf.stack(tensors)
      const ys = tf.tensor2d(labels)

      // Data augmentation
      const augmentedXs = DataPreprocessor.augmentImages(xs)

      // Create dataset
      const dataset = tf.data.zip({ xs: augmentedXs, ys: ys }).shuffle(100).batch(config.batchSize)

      // Split dataset
      const { train, validation } = DataPreprocessor.splitDataset(dataset)

      // Train model
      await trainerRef.current.train(train, validation, config.epochs, config.batchSize, config.learningRate)
      setMetrics(trainerRef.current.metrics)

      // Save model
      await trainerRef.current.saveModel("drone-detection-model")

      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Training failed")
      console.error("Training error:", err)
    } finally {
      setIsTraining(false)
    }
  }, [])

  return {
    trainModel,
    isTraining,
    progress,
    metrics,
    error,
  }
}

