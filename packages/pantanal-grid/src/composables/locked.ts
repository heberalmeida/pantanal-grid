import { computed, Ref } from 'vue'
import type { ColumnDef } from '../types'

export function useColumnLocked(columns: () => ColumnDef[], widths: Ref<number[]>) {
    const lockedMeta = computed(() => {
        const ordered = columns()
        const w = ordered.map((c, i) => widths.value[i] ?? c.width ?? 0)

        let accLeft = 0
        let accRight = 0
        const leftOffsets: (number | undefined)[] = []
        const rightOffsets: (number | undefined)[] = []

        for (let i = 0; i < ordered.length; i++) {
            if (ordered[i].locked === 'left' || ordered[i].locked === true) {
                leftOffsets[i] = accLeft
                accLeft += w[i] || 0
            }
        }
        for (let i = ordered.length - 1; i >= 0; i--) {
            if (ordered[i].locked === 'right') {
                rightOffsets[i] = accRight
                accRight += w[i] || 0
            }
        }

        return ordered.map((c, i) => {
            if (c.locked === 'left' || c.locked === true) return { side: 'left', left: leftOffsets[i] }
            if (c.locked === 'right') return { side: 'right', right: rightOffsets[i] }
            return { side: null }
        })
    })

    function lockedClass(i: number) {
        const meta = lockedMeta.value[i]
        if (!meta || !meta.side) return {}
        return {
            'v3grid__cell--locked': true,
            'v3grid__cell--locked-left': meta.side === 'left',
            'v3grid__cell--locked-right': meta.side === 'right',
        }
    }

    function lockedStyle(i: number) {
        const meta = lockedMeta.value[i]
        if (!meta || !meta.side) return undefined

        const cols = columns()
        const w = widths.value[i] ?? (cols[i] ? cols[i].width ?? 120 : 120)


        if (meta.side === 'left') {
            return { position: 'absolute', left: meta.left + 'px', width: w + 'px' }
        }
        if (meta.side === 'right') {
            return { position: 'sticky', right: meta.right + 'px', width: w + 'px' }
        }
    }


    return { lockedMeta, lockedClass, lockedStyle }
}
