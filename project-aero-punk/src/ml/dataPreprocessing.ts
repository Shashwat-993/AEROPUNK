import * as tf from "@tensorflow/tfjs"

export class DataPreprocessor {
  /**
   * Augments a batch of images with optional flipping, brightness, and rotation.
   * @param images - A 4D tensor representing the batch of images.
   * @param flip - Whether to apply random horizontal flips.
   * @param brightness - Range of random brightness adjustments.
   * @param angles - Array of rotation angles for each image.
   * @returns Augmented 4D tensor.
   */
  static augmentImages(images: tf.Tensor4D, flip = true, brightness = 0.1, angles: number[] = []): tf.Tensor4D {
    let augmented = images

    // Per-image random flip
    if (flip) {
      const flipMask = tf.randomUniform([augmented.shape[0]]).greater(0.5)
      augmented = tf.where(flipMask, tf.image.flipLeftRight(augmented), augmented)
    }

    // Per-image random brightness
    if (brightness > 0) {
      const delta = tf.randomUniform([augmented.shape[0], 1, 1, 1], -brightness, brightness)
      augmented = augmented.add(delta).clipByValue(0, 1)
    }

    // Rotation with offset
    if (angles.length > 0) {
      const angleTensor = tf.tensor1d(angles)
      augmented = tf.image.rotateWithOffset(augmented, angleTensor, 0.5, 0.5) // Center rotation
    }

    // Prevent premature disposal of tensors
    tf.keep(augmented)

    return augmented
  }

  /**
   * Shuffles and splits a dataset into training and validation sets.
   * @param dataset - The dataset to be split.
   * @param validationSplit - The fraction of data to be used for validation.
   * @returns An object containing training and validation datasets.
   */
  static splitDataset<T>(
    dataset: tf.data.Dataset<T>,
    validationSplit = 0.2,
  ): { train: tf.data.Dataset<T>; validation: tf.data.Dataset<T> } {
    const size = dataset.size()
    const valSize = Math.floor(size * validationSplit)

    return {
      train: dataset.take(size - valSize),
      validation: dataset.skip(size - valSize),
    }
  }
}

