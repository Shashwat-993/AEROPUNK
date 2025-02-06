import * as tf from "@tensorflow/tfjs"

export class ModelTrainer {
  model: tf.LayersModel
  metrics: Array<{ loss: number; accuracy: number; val_loss?: number; val_accuracy?: number }> = []

  constructor(model: tf.LayersModel) {
    this.model = model
  }

  /**
   * Trains the model using a dataset and logs the training process.
   * @param dataset - The training dataset.
   * @param validationData - The validation dataset.
   * @param epochs - Number of training epochs.
   * @param batchSize - Size of each training batch.
   * @param learningRate - Initial learning rate for the optimizer.
   */
  async train(
    dataset: tf.data.Dataset<tf.TensorContainer>,
    validationData: tf.data.Dataset<tf.TensorContainer>,
    epochs: number,
    batchSize: number,
    learningRate: number,
  ): Promise<void> {
    const optimizer = tf.train.adam(learningRate)

    this.model.compile({
      optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    })

    await this.model.fitDataset(dataset, {
      epochs,
      batchSize,
      validationData,
      callbacks: [
        tf.callbacks.earlyStopping({
          monitor: "val_loss",
          patience: 5,
        }),
        {
          onEpochEnd: async (epoch, logs) => {
            console.log(
              `Epoch ${epoch + 1}: Loss = ${logs?.loss}, Accuracy = ${logs?.acc}, Val_Loss = ${logs?.val_loss}, Val_Accuracy = ${logs?.val_acc}`,
            )
            this.metrics.push({
              loss: logs?.loss || 0,
              accuracy: logs?.acc || 0,
              val_loss: logs?.val_loss,
              val_accuracy: logs?.val_acc,
            })
          },
        },
      ],
    })
  }

  /**
   * Saves the trained model to IndexedDB.
   * @param path - The storage key for the model in IndexedDB.
   */
  async saveModel(path: string): Promise<void> {
    try {
      await this.model.save(`indexeddb://${path}`)
      console.log("Model saved successfully.")
    } catch (error) {
      console.error("Model save failed:", error)
      throw error
    }
  }

  /**
   * Predicts results for a given input tensor.
   * @param input - A 4D tensor representing the input batch.
   * @returns A 2D tensor containing the predictions.
   */
  async predict(input: tf.Tensor4D): Promise<tf.Tensor2D> {
    try {
      const result = this.model.predict(input) as tf.Tensor2D
      return result
    } catch (error) {
      console.error("Prediction failed:", error)
      throw error
    }
  }

  /**
   * Loads a model from IndexedDB.
   * @param path - The storage key for the model in IndexedDB.
   */
  async loadModel(path: string): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(`indexeddb://${path}`)
      console.log("Model loaded successfully.")
    } catch (error) {
      console.error("Model load failed:", error)
      throw error
    }
  }
}

